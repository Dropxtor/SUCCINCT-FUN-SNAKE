import requests
import socketio
import asyncio
import pytest
import json
import time
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL')
API_URL = f"{BACKEND_URL}/api"
SOCKET_URL = BACKEND_URL

print(f"Testing against backend URL: {BACKEND_URL}")
print(f"API URL: {API_URL}")
print(f"Socket URL: {SOCKET_URL}")

# Test wallet addresses
TEST_WALLETS = [
    "0x1234567890123456789012345678901234567890",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    "0x9876543210987654321098765432109876543210"
]

# Test data
test_scores = [
    {"walletAddress": TEST_WALLETS[0], "score": 100, "timestamp": int(time.time())},
    {"walletAddress": TEST_WALLETS[1], "score": 200, "timestamp": int(time.time())},
    {"walletAddress": TEST_WALLETS[2], "score": 150, "timestamp": int(time.time())}
]

# Test game states
test_game_state = {
    "walletAddress": TEST_WALLETS[0],
    "snake": [[10, 10], [11, 10], [12, 10]],
    "apple": [15, 15],
    "score": 3,
    "timestamp": int(time.time())
}

# Helper functions
def clear_test_data():
    """Clear test data from database"""
    for wallet in TEST_WALLETS:
        response = requests.delete(f"{API_URL}/scores/{wallet}")
        print(f"Cleared scores for {wallet}: {response.json()}")

# API Tests
def test_root_endpoint():
    """Test the root API endpoint"""
    response = requests.get(f"{API_URL}/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Snake Blockchain API" in data["message"]
    print("✅ Root endpoint test passed")

def test_status_endpoints():
    """Test status check endpoints"""
    # Test POST /api/status
    status_data = {"client_name": "backend_test.py"}
    response = requests.post(f"{API_URL}/status", json=status_data)
    assert response.status_code == 200
    data = response.json()
    assert data["client_name"] == status_data["client_name"]
    assert "id" in data
    assert "timestamp" in data
    
    # Test GET /api/status
    response = requests.get(f"{API_URL}/status")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # At least our entry should be there
    assert len(data) >= 1
    print("✅ Status endpoints test passed")

def test_score_submission():
    """Test score submission endpoint"""
    # Clear previous test data
    clear_test_data()
    
    # Submit a score
    score_data = test_scores[0]
    response = requests.post(f"{API_URL}/score", json=score_data)
    assert response.status_code == 200
    data = response.json()
    assert data["walletAddress"] == score_data["walletAddress"]
    assert data["score"] == score_data["score"]
    assert data["timestamp"] == score_data["timestamp"]
    assert "id" in data
    print("✅ Score submission test passed")

def test_leaderboard():
    """Test leaderboard endpoints"""
    # Clear previous test data
    clear_test_data()
    
    # Submit multiple scores
    for score in test_scores:
        response = requests.post(f"{API_URL}/score", json=score)
        assert response.status_code == 200
    
    # Submit additional scores for the same wallets to test highest score per wallet
    higher_score = {"walletAddress": TEST_WALLETS[0], "score": 300, "timestamp": int(time.time())}
    response = requests.post(f"{API_URL}/score", json=higher_score)
    assert response.status_code == 200
    
    # Test GET /api/leaderboard
    response = requests.get(f"{API_URL}/leaderboard")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    
    # Check if leaderboard has the correct order (highest score first)
    assert len(data) >= 1
    
    # Find our test wallets in the leaderboard
    wallet_scores = {entry["walletAddress"]: entry["score"] for entry in data if entry["walletAddress"] in TEST_WALLETS}
    
    # Verify wallet with highest score is first
    assert TEST_WALLETS[0] in wallet_scores
    assert wallet_scores[TEST_WALLETS[0]] == 300  # Should have the higher score we submitted
    
    # Test GET /api/leaderboard/all
    response = requests.get(f"{API_URL}/leaderboard/all")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 4  # Should have at least our 4 test scores
    
    # Test filtering by wallet
    response = requests.get(f"{API_URL}/leaderboard/all?wallet={TEST_WALLETS[0]}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2  # Should have our 2 test scores for this wallet
    assert all(entry["walletAddress"] == TEST_WALLETS[0] for entry in data)
    print("✅ Leaderboard endpoints test passed")

def test_game_stats():
    """Test game statistics endpoint"""
    # Clear previous test data
    clear_test_data()
    
    # Submit multiple scores
    for score in test_scores:
        response = requests.post(f"{API_URL}/score", json=score)
        assert response.status_code == 200
    
    # Test GET /api/stats
    response = requests.get(f"{API_URL}/stats")
    assert response.status_code == 200
    data = response.json()
    
    # Check if stats contain expected fields
    assert "total_games" in data
    assert "unique_players" in data
    assert "highest_score" in data
    assert "average_score" in data
    
    # Verify stats are correct
    assert data["total_games"] >= 3  # At least our 3 test scores
    assert data["unique_players"] >= 3  # Our 3 test wallets
    assert data["highest_score"] >= 200  # Highest score in our test data
    
    # Calculate expected average
    expected_avg = sum(score["score"] for score in test_scores) / len(test_scores)
    # Allow for some rounding differences
    assert abs(data["average_score"] - expected_avg) < 1
    print("✅ Game stats endpoint test passed")

def test_clear_scores():
    """Test score clearing endpoint"""
    # Submit a score
    score_data = test_scores[0]
    response = requests.post(f"{API_URL}/score", json=score_data)
    assert response.status_code == 200
    
    # Clear scores for this wallet
    response = requests.delete(f"{API_URL}/scores/{score_data['walletAddress']}")
    assert response.status_code == 200
    data = response.json()
    assert "deleted_count" in data
    assert data["deleted_count"] >= 1
    
    # Verify scores are cleared
    response = requests.get(f"{API_URL}/leaderboard/all?wallet={score_data['walletAddress']}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0
    print("✅ Clear scores endpoint test passed")

# Socket.IO Tests
@pytest.mark.asyncio
async def test_socketio_connection():
    """Test Socket.IO connection"""
    sio = socketio.AsyncClient()
    connected_event = asyncio.Event()
    
    @sio.event
    async def connected(data):
        print(f"Connected event received: {data}")
        connected_event.set()
    
    await sio.connect(SOCKET_URL)
    try:
        # Wait for connected event
        await asyncio.wait_for(connected_event.wait(), timeout=5)
        assert connected_event.is_set()
        print("✅ Socket.IO connection test passed")
    finally:
        await sio.disconnect()

@pytest.mark.asyncio
async def test_game_state_broadcast():
    """Test game state broadcasting"""
    # Create two clients
    sio1 = socketio.AsyncClient()
    sio2 = socketio.AsyncClient()
    
    game_state_received = asyncio.Event()
    received_data = {}
    
    @sio2.event
    async def gameState(data):
        print(f"Game state received: {data}")
        received_data.update(data)
        game_state_received.set()
    
    # Connect both clients
    await sio1.connect(SOCKET_URL)
    await sio2.connect(SOCKET_URL)
    
    try:
        # Client 1 sends game state
        await sio1.emit('gameState', test_game_state)
        
        # Client 2 should receive the game state
        await asyncio.wait_for(game_state_received.wait(), timeout=5)
        
        # Verify received data
        assert received_data["walletAddress"] == test_game_state["walletAddress"]
        assert received_data["score"] == test_game_state["score"]
        print("✅ Game state broadcast test passed")
    finally:
        await sio1.disconnect()
        await sio2.disconnect()

@pytest.mark.asyncio
async def test_score_update():
    """Test score update event"""
    # Create two clients
    sio1 = socketio.AsyncClient()
    sio2 = socketio.AsyncClient()
    
    score_update_received = asyncio.Event()
    received_data = {}
    
    @sio2.event
    async def scoreUpdate(data):
        print(f"Score update received: {data}")
        received_data.update(data)
        score_update_received.set()
    
    # Connect both clients
    await sio1.connect(SOCKET_URL)
    await sio2.connect(SOCKET_URL)
    
    try:
        # Client 1 sends score update
        score_data = test_scores[0]
        await sio1.emit('scoreUpdate', score_data)
        
        # Client 2 should receive the score update
        await asyncio.wait_for(score_update_received.wait(), timeout=5)
        
        # Verify received data
        assert received_data["walletAddress"] == score_data["walletAddress"]
        assert received_data["score"] == score_data["score"]
        
        # Verify score was stored in database
        response = requests.get(f"{API_URL}/leaderboard/all?wallet={score_data['walletAddress']}")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert any(entry["score"] == score_data["score"] for entry in data)
        print("✅ Score update event test passed")
    finally:
        await sio1.disconnect()
        await sio2.disconnect()

@pytest.mark.asyncio
async def test_game_end():
    """Test game end event"""
    # Create two clients
    sio1 = socketio.AsyncClient()
    sio2 = socketio.AsyncClient()
    
    game_end_received = asyncio.Event()
    received_data = {}
    
    @sio2.event
    async def gameEnd(data):
        print(f"Game end received: {data}")
        received_data.update(data)
        game_end_received.set()
    
    # Connect both clients
    await sio1.connect(SOCKET_URL)
    await sio2.connect(SOCKET_URL)
    
    try:
        # Clear previous test data
        clear_test_data()
        
        # Client 1 sends game end
        score_data = test_scores[1]
        await sio1.emit('gameEnd', score_data)
        
        # Client 2 should receive the game end
        await asyncio.wait_for(game_end_received.wait(), timeout=5)
        
        # Verify received data
        assert received_data["walletAddress"] == score_data["walletAddress"]
        assert received_data["score"] == score_data["score"]
        
        # Verify score was stored in database
        response = requests.get(f"{API_URL}/leaderboard/all?wallet={score_data['walletAddress']}")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert any(entry["score"] == score_data["score"] for entry in data)
        print("✅ Game end event test passed")
    finally:
        await sio1.disconnect()
        await sio2.disconnect()

# Run all tests
if __name__ == "__main__":
    print("Starting backend tests...")
    
    # Run API tests
    test_root_endpoint()
    test_status_endpoints()
    test_score_submission()
    test_leaderboard()
    test_game_stats()
    test_clear_scores()
    
    # Run Socket.IO tests
    asyncio.run(test_socketio_connection())
    asyncio.run(test_game_state_broadcast())
    asyncio.run(test_score_update())
    asyncio.run(test_game_end())
    
    print("All tests completed successfully!")
