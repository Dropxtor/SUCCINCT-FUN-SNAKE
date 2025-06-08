import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';

const CANVAS_SIZE = 400;
const SNAKE_START = [
  [8, 7],
  [8, 8]
];
const APPLE_START = [8, 3];
const SCALE = 20;
const SPEED = 200;
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1],  // down
  37: [-1, 0], // left
  39: [1, 0]   // right
};

const SnakeGame = ({ walletAddress, onGameEnd }) => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, 1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [socket, setSocket] = useState(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [particles, setParticles] = useState([]);

  // Initialize WebSocket connection
  useEffect(() => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    newSocket.on('gameState', (gameState) => {
      if (gameState.walletAddress !== walletAddress) {
        // Update other players' states if needed
      }
    });

    newSocket.on('scoreUpdate', (data) => {
      console.log('Score updated:', data);
    });

    return () => newSocket.close();
  }, [walletAddress]);

  // Create apple particle effect
  const createParticles = useCallback((x, y) => {
    const newParticles = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        x: x * SCALE + SCALE / 2,
        y: y * SCALE + SCALE / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 30,
        color: `hsl(${Math.random() * 60 + 300}, 100%, 60%)`
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Generate random apple position
  const createApple = useCallback(() => {
    return [
      Math.floor(Math.random() * (CANVAS_SIZE / SCALE)),
      Math.floor(Math.random() * (CANVAS_SIZE / SCALE))
    ];
  }, []);

  // Check collision
  const checkCollision = useCallback((piece, snk = snake) => {
    if (piece[0] * SCALE >= CANVAS_SIZE || piece[0] < 0 || piece[1] * SCALE >= CANVAS_SIZE || piece[1] < 0) {
      return true;
    }
    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) {
        return true;
      }
    }
    return false;
  }, [snake]);

  // Check apple collision
  const checkAppleCollision = useCallback((newSnake) => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      createParticles(apple[0], apple[1]);
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
      return { apple: newApple, scored: true };
    }
    return { apple, scored: false };
  }, [apple, createApple, checkCollision, createParticles]);

  // Game loop
  const gameLoop = useCallback(() => {
    setSnake(prev => {
      const newSnake = [...prev];
      const head = newSnake[newSnake.length - 1];
      
      const newHead = [head[0] + dir[0], head[1] + dir[1]];
      newSnake.push(newHead);
      
      if (checkCollision(newHead)) {
        setGameOver(true);
        setIsPlaying(false);
        if (socket) {
          socket.emit('gameEnd', { 
            walletAddress, 
            score,
            timestamp: Date.now()
          });
        }
        onGameEnd && onGameEnd(score);
        return prev;
      }

      const { apple: newApple, scored } = checkAppleCollision(newSnake);
      
      if (scored) {
        setApple(newApple);
        setScore(s => s + 10);
        if (socket) {
          socket.emit('scoreUpdate', { 
            walletAddress, 
            score: score + 10,
            timestamp: Date.now()
          });
        }
      } else {
        newSnake.shift();
      }

      return newSnake;
    });
  }, [dir, checkCollision, checkAppleCollision, socket, walletAddress, score, onGameEnd]);

  // Update particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.3,
          life: p.life - 1
        })).filter(p => p.life > 0)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Start game
  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDir([0, 1]);
    setSpeed(SPEED);
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setParticles([]);
  };

  // End game
  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
    setIsPlaying(false);
  };

  // Game loop interval
  useEffect(() => {
    if (speed !== null && isPlaying && !gameOver) {
      const interval = setInterval(gameLoop, speed);
      return () => clearInterval(interval);
    }
  }, [gameLoop, speed, isPlaying, gameOver]);

  // Handle keyboard input
  const moveSnake = useCallback((e) => {
    const { keyCode } = e;
    if (DIRECTIONS[keyCode]) {
      setDir(DIRECTIONS[keyCode]);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', moveSnake);
    return () => document.removeEventListener('keydown', moveSnake);
  }, [moveSnake]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with glitch effect
    if (glitchEffect) {
      ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 10%)`;
    } else {
      ctx.fillStyle = '#0a0a0a';
    }
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid with glow effect
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += SCALE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw snake with neon glow
    snake.forEach((segment, index) => {
      const hue = (index * 10 + Date.now() * 0.1) % 360;
      ctx.shadowBlur = 20;
      ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(segment[0] * SCALE + 2, segment[1] * SCALE + 2, SCALE - 4, SCALE - 4);
      
      // Inner glow
      ctx.shadowBlur = 5;
      ctx.fillStyle = `hsl(${hue}, 100%, 80%)`;
      ctx.fillRect(segment[0] * SCALE + 6, segment[1] * SCALE + 6, SCALE - 12, SCALE - 12);
    });

    // Draw apple with pulsing effect
    const time = Date.now() * 0.01;
    const pulseScale = 1 + Math.sin(time) * 0.2;
    const appleSize = SCALE * pulseScale;
    const offset = (SCALE - appleSize) / 2;
    
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#ff0080';
    ctx.fillStyle = '#ff0080';
    ctx.fillRect(
      apple[0] * SCALE + offset, 
      apple[1] * SCALE + offset, 
      appleSize, 
      appleSize
    );

    // Draw particles
    particles.forEach(particle => {
      ctx.shadowBlur = 10;
      ctx.shadowColor = particle.color;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
    });

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, apple, glitchEffect, particles]);

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* Score Display */}
      <div className="text-center">
        <div className={`text-4xl font-bold ${glitchEffect ? 'animate-pulse' : ''} text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400`}>
          SCORE: {score}
        </div>
        {walletAddress && (
          <div className="text-sm text-gray-400 mt-2">
            Player: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        )}
      </div>

      {/* Game Canvas */}
      <div className="relative">
        <canvas 
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className={`border-2 border-cyan-400 rounded-lg shadow-lg shadow-cyan-400/50 ${glitchEffect ? 'animate-ping' : ''}`}
        />
        
        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold text-red-400 mb-4 animate-pulse">GAME OVER</h2>
              <p className="text-xl mb-4">Final Score: {score}</p>
              <button 
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}

        {/* Start Game Overlay */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold text-cyan-400 mb-4 animate-pulse">SNAKE BLOCKCHAIN</h2>
              <p className="text-lg mb-4">Use arrow keys to control</p>
              <button 
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                START GAME
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls Info */}
      <div className="text-center text-gray-400 text-sm">
        <p>Use ↑ ↓ ← → keys to control the snake</p>
        <p className="mt-1">Collect the glowing orbs to increase your score!</p>
      </div>
    </div>
  );
};

export default SnakeGame;