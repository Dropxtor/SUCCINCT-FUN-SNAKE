from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import socketio
import json

# Socket.IO setup
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=True
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class GameScore(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    walletAddress: str
    score: int
    timestamp: int
    verified: bool = False

class GameScoreCreate(BaseModel):
    walletAddress: str
    score: int
    timestamp: int

class GameState(BaseModel):
    walletAddress: str
    snake: List[List[int]]
    apple: List[int]
    score: int
    timestamp: int

# Socket.IO Events
@sio.event
async def connect(sid, environ):
    print(f"Client {sid} connected")
    await sio.emit('connected', {'status': 'Connected to Snake Blockchain'}, room=sid)

@sio.event
async def disconnect(sid):
    print(f"Client {sid} disconnected")

@sio.event
async def gameState(sid, data):
    """Handle real-time game state updates"""
    try:
        game_state = GameState(**data)
        # Broadcast to all other clients except sender
        await sio.emit('gameState', data, skip_sid=sid)
        print(f"Game state updated for {game_state.walletAddress}")
    except Exception as e:
        print(f"Error handling game state: {e}")

@sio.event
async def scoreUpdate(sid, data):
    """Handle score updates"""
    try:
        # Store score in database
        score_data = GameScoreCreate(**data)
        score_obj = GameScore(**score_data.dict())
        await db.game_scores.insert_one(score_obj.dict())
        
        # Broadcast score update
        await sio.emit('scoreUpdate', data, skip_sid=sid)
        print(f"Score updated: {data}")
    except Exception as e:
        print(f"Error handling score update: {e}")

@sio.event
async def gameEnd(sid, data):
    """Handle game end and final score submission"""
    try:
        score_data = GameScoreCreate(**data)
        score_obj = GameScore(**score_data.dict())
        await db.game_scores.insert_one(score_obj.dict())
        
        # Emit to all clients for leaderboard updates
        await sio.emit('gameEnd', data)
        print(f"Game ended for {data.get('walletAddress')}: {data.get('score')} points")
    except Exception as e:
        print(f"Error handling game end: {e}")

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Snake Blockchain API - Powered by Succinct"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/score", response_model=GameScore)
async def submit_score(score_data: GameScoreCreate):
    """Submit a game score"""
    score_obj = GameScore(**score_data.dict())
    await db.game_scores.insert_one(score_obj.dict())
    return score_obj

@api_router.get("/leaderboard", response_model=List[GameScore])
async def get_leaderboard(limit: int = 10):
    """Get top scores for leaderboard"""
    # Get highest score per wallet address
    pipeline = [
        {"$sort": {"score": -1, "timestamp": -1}},
        {"$group": {
            "_id": "$walletAddress",
            "score": {"$first": "$score"},
            "timestamp": {"$first": "$timestamp"},
            "walletAddress": {"$first": "$walletAddress"},
            "id": {"$first": "$id"},
            "verified": {"$first": "$verified"}
        }},
        {"$sort": {"score": -1}},
        {"$limit": limit}
    ]
    
    scores = await db.game_scores.aggregate(pipeline).to_list(limit)
    return [GameScore(**score) for score in scores]

@api_router.get("/leaderboard/all", response_model=List[GameScore])
async def get_all_scores(wallet: Optional[str] = None, limit: int = 50):
    """Get all scores, optionally filtered by wallet"""
    query = {}
    if wallet:
        query["walletAddress"] = wallet
    
    scores = await db.game_scores.find(query).sort("score", -1).limit(limit).to_list(limit)
    return [GameScore(**score) for score in scores]

@api_router.delete("/scores/{wallet_address}")
async def clear_scores(wallet_address: str):
    """Clear all scores for a wallet (for testing)"""
    result = await db.game_scores.delete_many({"walletAddress": wallet_address})
    return {"deleted_count": result.deleted_count}

@api_router.get("/stats")
async def get_game_stats():
    """Get overall game statistics"""
    total_games = await db.game_scores.count_documents({})
    unique_players = len(await db.game_scores.distinct("walletAddress"))
    
    # Get highest score
    highest_score_doc = await db.game_scores.find_one(sort=[("score", -1)])
    highest_score = highest_score_doc["score"] if highest_score_doc else 0
    
    # Get average score
    avg_pipeline = [{"$group": {"_id": None, "avg_score": {"$avg": "$score"}}}]
    avg_result = await db.game_scores.aggregate(avg_pipeline).to_list(1)
    avg_score = avg_result[0]["avg_score"] if avg_result else 0
    
    return {
        "total_games": total_games,
        "unique_players": unique_players,
        "highest_score": highest_score,
        "average_score": round(avg_score, 2)
    }

# Include the router in the main app
app.include_router(api_router)

# Mount Socket.IO
socket_app = socketio.ASGIApp(sio, app)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Snake Blockchain API started")
    # Create indexes for better performance
    await db.game_scores.create_index([("walletAddress", 1), ("score", -1)])
    await db.game_scores.create_index([("score", -1), ("timestamp", -1)])

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Export socket app for ASGI server
application = socket_app
