import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SnakeGame from "./components/SnakeGame";
import SmartWalletConnect from "./components/SmartWalletConnect";
import Leaderboard from "./components/Leaderboard";
import SuccinctLogoNew from "./components/SuccinctLogoNew";
import RainbowAppKitProvider from "./components/RainbowAppKitProvider";
import { 
  DigitalRain, 
  FloatingGeometry, 
  CyberGrid, 
  NeuralNetwork,
  HolographicText
} from "./components/FuturisticEffects";
import { FuturisticCard } from "./components/FuturisticUI";

const Home = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);
  const [particles, setParticles] = useState([]);

  // Enhanced periodic glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 300);
    }, 6000 + Math.random() * 4000);
    
    return () => clearInterval(interval);
  }, []);

  // Advanced floating particles system
  useEffect(() => {
    const createParticle = () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      color: ['purple', 'pink', 'cyan', 'blue', 'yellow'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 3 + 1,
      rotation: Math.random() * 360,
      type: ['dot', 'plus', 'triangle'][Math.floor(Math.random() * 3)]
    });

    const initialParticles = Array.from({ length: 25 }, createParticle);
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          y: (particle.y - particle.speed + 100) % 100,
          rotation: (particle.rotation + 2) % 360,
          x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.1
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleWalletConnected = (address) => {
    setWalletAddress(address);
    console.log('🔗 Wallet connected:', address);
  };

  const handleWalletDisconnected = () => {
    setWalletAddress(null);
    setCurrentScore(0);
    console.log('🔌 Wallet disconnected');
  };

  const handleGameEnd = (score) => {
    setCurrentScore(score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black relative overflow-hidden">
      {/* Advanced Background Effects */}
      <DigitalRain />
      <FloatingGeometry />
      <CyberGrid />
      <NeuralNetwork />
      
      {/* Dynamic background with multiple layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Cyberpunk city background */}
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1601042879364-f3947d3f9c16')`,
            filter: 'hue-rotate(45deg) contrast(1.2)'
          }}
        ></div>
        
        {/* Enhanced animated blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob quantum-effect"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-2000 neural-pulse"></div>
        <div className="absolute top-40 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* Advanced particle system */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute opacity-40"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: `rotate(${particle.rotation}deg)`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              filter: `drop-shadow(0 0 5px ${
                particle.color === 'purple' ? '#8b5cf6' : 
                particle.color === 'pink' ? '#ec4899' : 
                particle.color === 'cyan' ? '#06b6d4' : 
                particle.color === 'yellow' ? '#f59e0b' : '#3b82f6'
              })`
            }}
          >
            {particle.type === 'dot' && (
              <div 
                className={`w-full h-full rounded-full bg-${particle.color}-400 animate-pulse`}
              ></div>
            )}
            {particle.type === 'plus' && (
              <div className={`text-${particle.color}-400 text-xs`}>+</div>
            )}
            {particle.type === 'triangle' && (
              <div 
                className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent"
                style={{ 
                  borderBottomColor: particle.color === 'purple' ? '#8b5cf6' : 
                                     particle.color === 'pink' ? '#ec4899' : 
                                     particle.color === 'cyan' ? '#06b6d4' : 
                                     particle.color === 'yellow' ? '#f59e0b' : '#3b82f6'
                }}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Futuristic Header */}
      <header className={`relative z-10 p-6 ${showGlitch ? 'cyber-glitch' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            {/* Enhanced logo and title section */}
            <div className="flex items-center justify-center space-x-6 mb-8">
              <SuccinctLogoNew size="xlarge" animated={true} className="float" />
              <div className="text-left">
                <HolographicText>
                  <h1 className={`text-8xl font-bold ${showGlitch ? 'cyber-glitch gradient-text-succinct' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400'} transition-all duration-300 succinct-title`}>
                    SUCCINCT
                  </h1>
                </HolographicText>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="w-32 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">🐍</span>
                  </div>
                  <HolographicText>
                    <span className={`text-4xl font-bold ${showGlitch ? 'text-cyan-500 cyber-glitch' : 'text-white'} succinct-subtitle`}>
                      SNAKE
                    </span>
                  </HolographicText>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <HolographicText>
                <p className="text-2xl text-gray-300 mb-3 succinct-font">
                  ⚡ Real-time multiplayer Snake with Monad transactions ⚡
                </p>
              </HolographicText>
              <p className="text-xl text-purple-300 mb-4">
                🏎️ Built on Monad Network - Every score generates blockchain transactions
              </p>
              
              <div className="flex justify-center items-center space-x-4 text-lg text-gray-400">
                <span>🛠️ Created by</span>
                <a 
                  href="https://x.com/0xDropxtor" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold text-2xl succinct-font hover:scale-110 transform cyber-border px-4 py-2 rounded-lg"
                >
                  dropxtor
                </a>
                <span className="just-for-fun text-xl font-bold">just for fun</span>
              </div>
            </div>
          </div>

          {/* Rainbow AppKit Wallet Connection */}
          <div className="mb-8 flex justify-center">
            <SmartWalletConnect 
              onWalletConnected={handleWalletConnected}
              onWalletDisconnected={handleWalletDisconnected}
            />
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        {walletAddress ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Game Area with advanced effects */}
            <div className="lg:col-span-2">
              <FuturisticCard className="p-0 overflow-hidden" glowing animated>
                <div className="relative">
                  <SnakeGame 
                    walletAddress={walletAddress}
                    onGameEnd={handleGameEnd}
                  />
                </div>
              </FuturisticCard>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Advanced Stats Panel */}
              <FuturisticCard title="BLOCKCHAIN PLAYER" glowing animated>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Wallet:</span>
                    <span className="text-white font-mono text-sm terminal-text">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-green-400 flex items-center space-x-2">
                      <span>🏎️</span>
                      <span className="holographic-shimmer">Monad Testnet</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current Score:</span>
                    <HolographicText>
                      <span className="text-cyan-400 font-bold text-2xl">{currentScore}</span>
                    </HolographicText>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Transactions:</span>
                    <span className="text-purple-400 zk-proof-effect">✅ Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Snake Head:</span>
                    <div className="flex items-center space-x-2">
                      <SuccinctLogoNew size="small" animated={false} />
                      <span className="text-cyan-400 text-sm">Real Logo!</span>
                    </div>
                  </div>
                </div>
              </FuturisticCard>

              {/* Enhanced Leaderboard */}
              <FuturisticCard className="overflow-hidden">
                <Leaderboard 
                  currentScore={currentScore}
                  walletAddress={walletAddress}
                />
              </FuturisticCard>

              {/* Advanced Game Info */}
              <FuturisticCard title="MONAD FEATURES" glowing animated>
                <ul className="space-y-4 text-gray-300 text-sm">
                  <li className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse neural-pulse"></div>
                    <span>🔗 Real Monad transactions</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse quantum-effect"></div>
                    <span>💰 Score milestones → blockchain</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-pink-400 rounded-full animate-pulse holographic-shimmer"></div>
                    <span>✨ ZK proof integration</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse matrix-cascade"></div>
                    <span>🏎️ Lightning-fast network</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span>🎮 Rainbow AppKit wallet</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <SuccinctLogoNew size="small" animated={true} />
                    <span>🐍 Real Succinct logo in snake!</span>
                  </li>
                </ul>
                
                {/* Enhanced transaction info */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-3 succinct-font">Transaction Schedule</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Every 50 points:</span>
                      <span className="text-green-400">✅ Milestone TX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Game over:</span>
                      <span className="text-blue-400">📄 Final TX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gas fees:</span>
                      <span className="text-yellow-400">💰 ~0.001 MON</span>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Succinct stickers integration */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-3 succinct-font">Powered by Succinct Labs</p>
                  <div className="flex space-x-3 justify-center">
                    <img 
                      src="https://succinct-pfp-customize.vercel.app/stickers/1_(1).webp" 
                      alt="Succinct" 
                      className="w-8 h-8 rounded animate-bounce neural-pulse"
                    />
                    <img 
                      src="https://succinct-pfp-customize.vercel.app/stickers/1_(2).webp" 
                      alt="Succinct" 
                      className="w-8 h-8 rounded animate-pulse quantum-effect"
                    />
                    <img 
                      src="https://succinct-pfp-customize.vercel.app/stickers/5_(1).webp" 
                      alt="Succinct" 
                      className="w-8 h-8 rounded animate-spin holographic-shimmer"
                      style={{ animationDuration: '4s' }}
                    />
                    <img 
                      src="https://succinct-pfp-customize.vercel.app/stickers/crab_nerd.webp" 
                      alt="Succinct Crab" 
                      className="w-8 h-8 rounded matrix-cascade"
                    />
                  </div>
                </div>
              </FuturisticCard>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <FuturisticCard className="max-w-4xl mx-auto" glowing animated>
              <div className="mb-8">
                <div className="flex justify-center mb-6">
                  <SuccinctLogoNew size="xlarge" animated={true} className="float neural-pulse" />
                </div>
                <div className="text-9xl mb-8 animate-bounce">🐍</div>
              </div>
              
              <HolographicText>
                <h2 className="text-5xl font-bold text-white mb-6 succinct-title">
                  Welcome to <span className="gradient-text-succinct">Succinct Snake</span>
                </h2>
              </HolographicText>
              
              <p className="text-gray-400 mb-8 text-xl leading-relaxed">
                The first real-time multiplayer Snake game that generates{' '}
                <span className="text-green-400 font-bold quantum-effect">real Monad transactions</span>{' '}
                powered by{' '}
                <span className="text-purple-400 font-bold holographic-shimmer">Succinct</span>{' '}
                zero-knowledge proofs.
                <br />
                <span className="just-for-fun text-lg">Connect your wallet to start playing! 🚀</span>
              </p>
              
              <div className="grid grid-cols-2 gap-6 text-lg text-gray-300 mb-8">
                <FuturisticCard className="p-8" animated>
                  <div className="text-cyan-400 font-bold text-2xl mb-3">🔗 Blockchain</div>
                  <div>Every score milestone generates <strong>real Monad transactions</strong>!</div>
                </FuturisticCard>
                <FuturisticCard className="p-8" animated>
                  <div className="text-purple-400 font-bold text-2xl mb-3">🐍 Snake Head</div>
                  <div>Features the <strong>real Succinct logo</strong> as head</div>
                </FuturisticCard>
                <FuturisticCard className="p-8" animated>
                  <div className="text-pink-400 font-bold text-2xl mb-3">🌈 Rainbow Kit</div>
                  <div>Professional wallet connection with all major wallets</div>
                </FuturisticCard>
                <FuturisticCard className="p-8" animated>
                  <div className="text-green-400 font-bold text-2xl mb-3">🏆 Compete</div>
                  <div>Global leaderboard with blockchain verification</div>
                </FuturisticCard>
              </div>

              {/* Enhanced Succinct stickers showcase */}
              <div className="flex justify-center space-x-6 opacity-80 mb-8">
                <img 
                  src="https://succinct-pfp-customize.vercel.app/stickers/crab_nerd.webp" 
                  alt="Succinct Crab" 
                  className="w-16 h-16 animate-bounce neural-pulse"
                />
                <img 
                  src="https://succinct-pfp-customize.vercel.app/stickers/4090_(1).webp" 
                  alt="Succinct" 
                  className="w-16 h-16 animate-pulse quantum-effect"
                />
                <img 
                  src="https://succinct-pfp-customize.vercel.app/stickers/1_(1).webp" 
                  alt="Succinct" 
                  className="w-16 h-16 holographic-shimmer"
                />
              </div>

              <div className="bg-yellow-900/30 border border-yellow-400/50 rounded-lg p-4 mb-8">
                <div className="text-yellow-400 font-bold mb-2">🔔 Blockchain Integration Active</div>
                <p className="text-sm text-gray-300">
                  This game generates real transactions on Monad testnet! 
                  Every 50 points and game completion will trigger a blockchain transaction.
                </p>
              </div>
            </FuturisticCard>
          </div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="relative z-10 text-center py-8 text-gray-500 text-sm">
        <HolographicText>
          <p className="succinct-font">
            Built with ❤️ by dropxtor | Powered by Succinct Labs & Monad Network
            <span className="just-for-fun ml-2">just for fun!</span>
          </p>
        </HolographicText>
      </footer>
    </div>
  );
};

function App() {
  return (
    <RainbowAppKitProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </RainbowAppKitProvider>
  );
}

export default App;
