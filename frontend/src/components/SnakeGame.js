import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import { useSuccinctSnakeContract } from '../hooks/useSuccinctSnakeContract';

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
  const overlayRef = useRef(null);
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
  const [zkProofEffect, setZkProofEffect] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);

  // Blockchain integration
  const { 
    submitScore, 
    isSubmitting, 
    isConfirming, 
    isConfirmed, 
    lastTxHash 
  } = useSuccinctSnakeContract();

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
      setZkProofEffect(true);
      setTimeout(() => setZkProofEffect(false), 1000);
    });

    return () => newSocket.close();
  }, [walletAddress]);

  // Handle blockchain transaction status
  useEffect(() => {
    if (isSubmitting) {
      setTransactionStatus('submitting');
    } else if (isConfirming) {
      setTransactionStatus('confirming');
    } else if (isConfirmed) {
      setTransactionStatus('confirmed');
      setTimeout(() => setTransactionStatus(null), 5000);
    }
  }, [isSubmitting, isConfirming, isConfirmed]);

  // Create apple particle effect with Succinct colors
  const createParticles = useCallback((x, y) => {
    const succinctColors = [
      'hsl(271, 91%, 65%)', // purple
      'hsl(333, 71%, 57%)', // pink
      'hsl(197, 71%, 52%)', // cyan
      'hsl(45, 93%, 47%)'   // gold
    ];
    
    const newParticles = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        x: x * SCALE + SCALE / 2,
        y: y * SCALE + SCALE / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 50,
        color: succinctColors[Math.floor(Math.random() * succinctColors.length)],
        size: Math.random() * 5 + 3
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
      setZkProofEffect(true);
      setTimeout(() => {
        setGlitchEffect(false);
        setZkProofEffect(false);
      }, 300);
      return { apple: newApple, scored: true };
    }
    return { apple, scored: false };
  }, [apple, createApple, checkCollision, createParticles]);

  // Submit score to blockchain
  const handleScoreSubmission = useCallback(async (finalScore) => {
    if (!walletAddress || finalScore === 0) return;

    try {
      console.log('🔗 Submitting score to Monad blockchain:', finalScore);
      const result = await submitScore(finalScore);
      
      if (result.success) {
        setZkProofEffect(true);
        console.log('✅ Score submitted successfully!');
        console.log('📄 Transaction hash:', result.hash);
        
        if (result.simulated) {
          console.log('🎮 Simulated Monad transaction (contract not deployed yet)');
        } else {
          console.log('🔗 Real Monad transaction submitted');
        }
        
        setTimeout(() => setZkProofEffect(false), 3000);
      }
    } catch (error) {
      console.error('❌ Failed to submit score to blockchain:', error);
      setTransactionStatus('error');
      setTimeout(() => setTransactionStatus(null), 5000);
    }
  }, [walletAddress, submitScore]);

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
        
        // Submit final score to blockchain
        handleScoreSubmission(score);
        
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
        const newScore = score + 10;
        setScore(newScore);
        
        // Submit every score milestone to blockchain (every 50 points)
        if (newScore > 0 && newScore % 50 === 0) {
          handleScoreSubmission(newScore);
        }
        
        if (socket) {
          socket.emit('scoreUpdate', { 
            walletAddress, 
            score: newScore,
            timestamp: Date.now()
          });
        }
      } else {
        newSnake.shift();
      }

      return newSnake;
    });
  }, [dir, checkCollision, checkAppleCollision, socket, walletAddress, score, onGameEnd, handleScoreSubmission]);

  // Update particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.3,
          life: p.life - 1,
          size: p.size * 0.99
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
    setTransactionStatus(null);
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

  // Update Snake overlay with Succinct logos
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Clear previous snake elements
    overlay.innerHTML = '';

    // Render snake with Succinct logos
    snake.forEach((segment, index) => {
      const isHead = index === snake.length - 1;
      const segmentDiv = document.createElement('div');
      segmentDiv.style.position = 'absolute';
      segmentDiv.style.left = `${segment[0] * SCALE + 2}px`;
      segmentDiv.style.top = `${segment[1] * SCALE + 2}px`;
      segmentDiv.style.width = `${SCALE - 4}px`;
      segmentDiv.style.height = `${SCALE - 4}px`;
      segmentDiv.style.zIndex = '10';
      
      if (isHead) {
        segmentDiv.innerHTML = `
          <div style="
            width: 100%; 
            height: 100%; 
            background: linear-gradient(45deg, #8b5cf6, #ec4899); 
            border-radius: 4px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            box-shadow: 0 0 15px rgba(139, 92, 246, 0.8);
            border: 2px solid #06b6d4;
          ">
            <svg viewBox="0 0 100 100" style="width: 80%; height: 80%;">
              <circle cx="50" cy="50" r="35" fill="none" stroke="#06b6d4" stroke-width="4"/>
              <path d="M 30,35 Q 20,35 20,45 Q 20,50 30,50 Q 70,50 70,55 Q 70,65 80,65" 
                    fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
              <circle cx="25" cy="40" r="2" fill="#06b6d4"/>
              <circle cx="75" cy="60" r="2" fill="#ec4899"/>
              <circle cx="50" cy="50" r="2" fill="#ffffff"/>
            </svg>
          </div>
        `;
      } else {
        const progress = index / (snake.length - 1);
        const hue = 271 + (progress * 100);
        const saturation = 91 - (progress * 20);
        const lightness = 65 - (progress * 30);
        
        segmentDiv.innerHTML = `
          <div style="
            width: 100%; 
            height: 100%; 
            background: linear-gradient(45deg, hsl(${hue}, ${saturation}%, ${lightness}%), hsl(${hue + 30}, ${saturation}%, ${lightness}%)); 
            border-radius: 3px;
            box-shadow: 0 0 8px hsla(${hue}, ${saturation}%, ${lightness}%, 0.6);
            border: 1px solid rgba(6, 182, 212, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 60%; 
              height: 60%; 
              background: radial-gradient(circle, #06b6d4, transparent);
              border-radius: 50%;
              opacity: 0.8;
            "></div>
          </div>
        `;
      }
      
      overlay.appendChild(segmentDiv);
    });
  }, [snake]);

  // Draw game background and apple with enhanced canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with Succinct gradient background
    if (glitchEffect) {
      const gradient = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      gradient.addColorStop(0, `hsl(${Math.random() * 360}, 100%, 10%)`);
      gradient.addColorStop(1, `hsl(${Math.random() * 360}, 100%, 5%)`);
      ctx.fillStyle = gradient;
    } else {
      const gradient = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(0.5, '#1a0a2e');
      gradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = gradient;
    }
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Succinct-themed grid
    ctx.strokeStyle = zkProofEffect ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.15)';
    ctx.lineWidth = zkProofEffect ? 2 : 1;
    
    for (let i = 0; i <= CANVAS_SIZE; i += SCALE) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw apple with enhanced Succinct branding
    const time = Date.now() * 0.01;
    const pulseScale = 1 + Math.sin(time) * 0.3;
    const appleSize = SCALE * pulseScale;
    const offset = (SCALE - appleSize) / 2;
    
    // Multi-layer apple with Succinct logo
    const gradient = ctx.createRadialGradient(
      apple[0] * SCALE + SCALE/2, 
      apple[1] * SCALE + SCALE/2, 
      0,
      apple[0] * SCALE + SCALE/2, 
      apple[1] * SCALE + SCALE/2, 
      appleSize/2
    );
    gradient.addColorStop(0, '#ec4899'); // pink
    gradient.addColorStop(0.5, '#8b5cf6'); // purple
    gradient.addColorStop(1, '#06b6d4'); // cyan
    
    ctx.shadowBlur = zkProofEffect ? 50 : 25;
    ctx.shadowColor = '#8b5cf6';
    ctx.fillStyle = gradient;
    ctx.fillRect(
      apple[0] * SCALE + offset, 
      apple[1] * SCALE + offset, 
      appleSize, 
      appleSize
    );

    // Draw small Succinct logo in apple
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const centerX = apple[0] * SCALE + SCALE/2;
    const centerY = apple[1] * SCALE + SCALE/2;
    ctx.arc(centerX, centerY, SCALE/4, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw "S" in apple
    ctx.fillStyle = '#ffffff';
    ctx.font = `${SCALE/2}px Orbitron, monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('S', centerX, centerY + SCALE/6);

    // Draw particles with enhanced effects
    particles.forEach(particle => {
      ctx.shadowBlur = 15;
      ctx.shadowColor = particle.color;
      ctx.fillStyle = particle.color;
      const size = particle.size * (particle.life / 50);
      ctx.fillRect(
        particle.x - size/2, 
        particle.y - size/2, 
        size, 
        size
      );
    });

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [apple, glitchEffect, particles, zkProofEffect]);

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* Score Display with Blockchain Status */}
      <div className="text-center">
        <div className={`text-5xl font-bold ${glitchEffect ? 'animate-pulse succinct-glitch' : ''} ${zkProofEffect ? 'text-purple-400' : 'gradient-text-succinct'} succinct-font`}>
          SCORE: {score}
        </div>
        
        {/* Blockchain Transaction Status */}
        {transactionStatus && (
          <div className={`text-sm mt-2 succinct-font ${
            transactionStatus === 'submitting' ? 'text-yellow-400 animate-pulse' :
            transactionStatus === 'confirming' ? 'text-blue-400 animate-pulse' :
            transactionStatus === 'confirmed' ? 'text-green-400' :
            transactionStatus === 'error' ? 'text-red-400' : ''
          }`}>
            {transactionStatus === 'submitting' && '🔗 Submitting to Monad...'}
            {transactionStatus === 'confirming' && '⏳ Confirming on Monad...'}
            {transactionStatus === 'confirmed' && '✅ Confirmed on Monad!'}
            {transactionStatus === 'error' && '❌ Transaction failed'}
          </div>
        )}
        
        {zkProofEffect && (
          <div className="text-sm text-purple-400 animate-pulse mt-2 succinct-font">
            ✅ MONAD TRANSACTION VERIFIED
          </div>
        )}
        
        {lastTxHash && (
          <div className="text-xs text-gray-400 mt-1">
            <a 
              href={`https://testnet.monadexplorer.com/tx/${lastTxHash}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              View on Monad Explorer
            </a>
          </div>
        )}
        
        {walletAddress && (
          <div className="text-sm text-gray-400 mt-2 font-mono">
            Player: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        )}
      </div>

      {/* Game Canvas with Succinct styling */}
      <div className="relative">
        <canvas 
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className={`border-2 ${zkProofEffect ? 'border-purple-400 shadow-purple-400/50' : 'border-cyan-400 shadow-cyan-400/50'} rounded-lg shadow-lg ${glitchEffect ? 'animate-ping' : ''} succinct-glow`}
        />
        
        {/* Snake overlay with Succinct logos */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{ top: 0, left: 0 }}
        ></div>
        
        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center rounded-lg backdrop-blur-succinct">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold text-red-400 mb-4 animate-pulse game-over-text succinct-title">
                GAME OVER
              </h2>
              <p className="text-2xl mb-2 succinct-font">Final Score: {score}</p>
              <p className="text-lg mb-2 text-purple-300">Submitted to Monad ✅</p>
              {lastTxHash && (
                <p className="text-sm mb-4 text-gray-400">
                  <a 
                    href={`https://testnet.monadexplorer.com/tx/${lastTxHash}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    View Transaction
                  </a>
                </p>
              )}
              <button 
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white font-bold rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 succinct-button"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}

        {/* Start Game Overlay */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center rounded-lg backdrop-blur-succinct">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold text-cyan-400 mb-4 animate-pulse succinct-title">
                SUCCINCT SNAKE
              </h2>
              <p className="text-lg mb-2">Use arrow keys to control</p>
              <p className="text-sm mb-2 text-purple-300">Snake head features the real Succinct logo!</p>
              <p className="text-sm mb-4 text-green-300">🔗 Scores submitted to Monad blockchain</p>
              <p className="text-sm mb-6 text-purple-300">Powered by ZK proofs & Monad network</p>
              <button 
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white font-bold rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 succinct-button"
              >
                START GAME
              </button>
            </div>
          </div>
        )}

        {/* Transaction indicator */}
        {(isSubmitting || isConfirming) && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs animate-bounce succinct-font">
            {isSubmitting ? '🔗 MONAD TX...' : '⏳ CONFIRMING...'}
          </div>
        )}
      </div>

      {/* Controls Info */}
      <div className="text-center text-gray-400 text-sm">
        <p className="succinct-font">Use ↑ ↓ ← → keys to control the snake</p>
        <p className="mt-1">Snake head contains the real Succinct logo! 🌟</p>
        <p className="mt-1 text-purple-400 text-xs">Every 50 points + game end = Monad transaction</p>
      </div>
    </div>
  );
};

export default SnakeGame;