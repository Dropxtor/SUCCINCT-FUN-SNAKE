import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SnakeGame from "./components/SnakeGame";
import WalletConnect from "./components/WalletConnect";
import Leaderboard from "./components/Leaderboard";
import SuccinctLogo, { SuccinctOrb, SuccinctSnakeLogo } from "./components/SuccinctLogo";

const Home = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);
  const [particles, setParticles] = useState([]);

  // Periodic glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 150);
    }, 8000 + Math.random() * 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Floating particles animation
  useEffect(() => {
    const createParticle = () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: ['purple', 'pink', 'cyan', 'blue'][Math.floor(Math.random() * 4)],
      speed: Math.random() * 2 + 1
    });

    const initialParticles = Array.from({ length: 15 }, createParticle);
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          y: (particle.y - particle.speed + 100) % 100
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleWalletConnected = (address) => {
    setWalletAddress(address);
  };

  const handleWalletDisconnected = () => {
    setWalletAddress(null);
    setCurrentScore(0);
  };

  const handleGameEnd = (score) => {
    setCurrentScore(score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black relative overflow-hidden">
      {/* Animated Background with Succinct-themed elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Background image overlay */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1601042879364-f3947d3f9c16')`
          }}
        ></div>
        
        {/* Animated blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Floating particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`absolute w-${particle.size} h-${particle.size} bg-${particle.color}-400 rounded-full opacity-30 animate-pulse`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
          ></div>
        ))}

        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/8108728/pexels-photo-8108728.jpeg')`
          }}
        ></div>

        {/* Floating Succinct orbs */}
        <SuccinctOrb className="absolute top-20 left-20 animate-bounce" size="small" />
        <SuccinctOrb className="absolute top-40 right-32 animate-pulse" size="medium" />
        <SuccinctOrb className="absolute bottom-32 left-1/4 animate-ping" size="small" />
        <SuccinctOrb className="absolute bottom-20 right-20 animate-bounce" size="large" />
      </div>

      {/* Header */}
      <header className={`relative z-10 p-6 ${showGlitch ? 'animate-pulse' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            {/* Main logo and title */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <SuccinctLogo size="xlarge" animated={true} />
              <div className="text-left">
                <h1 className={`text-7xl font-bold ${showGlitch ? 'text-red-500 glitch-text' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400'} transition-all duration-300 succinct-title`}>
                  SUCCINCT
                </h1>
                <div className="flex items-center space-x-2">
                  <SuccinctSnakeLogo />
                  <span className={`text-3xl font-bold ${showGlitch ? 'text-cyan-500' : 'text-white'} succinct-subtitle`}>
                    SNAKE
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-xl text-gray-300 mb-3 succinct-font">
              ⚡ Real-time multiplayer Snake powered by ZK proofs ⚡
            </p>
            <p className="text-lg text-purple-300 mb-4">
              🏎️ Built on Monad Network - The fastest blockchain
            </p>
            
            <div className="flex justify-center items-center space-x-3 text-sm text-gray-400">
              <span>🛠️ Created by</span>
              <a 
                href="https://x.com/0xDropxtor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold text-lg succinct-font hover:scale-110 transform"
              >
                dropxtor
              </a>
              <span className="text-pink-400">✨</span>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="mb-8">
            <WalletConnect 
              onWalletConnected={handleWalletConnected}
              onWalletDisconnected={handleWalletDisconnected}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        {walletAddress ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Game Area */}
            <div className="lg:col-span-2">
              <div className="relative">
                {/* Game background with Succinct stickers */}
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 blur-lg"></div>
                <SnakeGame 
                  walletAddress={walletAddress}
                  onGameEnd={handleGameEnd}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-gradient-to-b from-gray-900/80 to-black/80 p-6 rounded-xl border border-purple-500/50 backdrop-blur-md">
                <div className="flex items-center space-x-2 mb-4">
                  <SuccinctLogo size="medium" />
                  <h3 className="text-xl font-bold text-cyan-400 succinct-font">PLAYER STATS</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wallet:</span>
                    <span className="text-white font-mono text-sm">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-green-400 flex items-center space-x-1">
                      <span>🏎️</span>
                      <span>Monad Testnet</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Score:</span>
                    <span className="text-cyan-400 font-bold text-xl">{currentScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ZK Proofs:</span>
                    <span className="text-purple-400">✅ Verified</span>
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <Leaderboard 
                currentScore={currentScore}
                walletAddress={walletAddress}
              />

              {/* Game Info */}
              <div className="bg-gradient-to-b from-purple-900/80 to-black/80 p-6 rounded-xl border border-purple-400/50 backdrop-blur-md">
                <div className="flex items-center space-x-2 mb-4">
                  <SuccinctOrb size="medium" />
                  <h3 className="text-xl font-bold text-purple-400 succinct-font">SUCCINCT FEATURES</h3>
                </div>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span>⚡ Real-time multiplayer</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>🔗 Blockchain score storage</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                    <span>✨ Zero-knowledge proofs</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span>🏎️ Monad network speed</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span>🎮 Succinct-powered gaming</span>
                  </li>
                </ul>
                
                {/* Succinct stickers integration */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Powered by Succinct Labs</p>
                  <div className="flex space-x-2">
                    <img 
                      src="https://succinct-pfp-customize.vercel.app/stickers/1_(1).webp" 
                      alt="Succinct" 
                      className="w-6 h-6 rounded animate-bounce"
                    />
                    <img 
                      src="https://succinct-pfp-customize.vercel.app/stickers/1_(2).webp" 
                      alt="Succinct" 
                      className="w-6 h-6 rounded animate-pulse"
                    />
                    <img 
                      src="https://succinct-pfp-customize.vercel.app/stickers/5_(1).webp" 
                      alt="Succinct" 
                      className="w-6 h-6 rounded animate-spin"
                      style={{ animationDuration: '3s' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <SuccinctLogo size="xlarge" animated={true} className="mx-auto mb-4" />
                <div className="text-8xl mb-6 animate-bounce">🐍</div>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-4 succinct-title">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Succinct Snake</span>
              </h2>
              
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                The first real-time multiplayer Snake game powered by{' '}
                <span className="text-purple-400 font-bold">Succinct</span> zero-knowledge proofs and{' '}
                <span className="text-green-400 font-bold">Monad</span> blockchain technology.
                Connect your wallet to start playing! 🚀
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-8">
                <div className="bg-gray-800/50 p-6 rounded-xl border border-cyan-400/30 backdrop-blur">
                  <div className="text-cyan-400 font-bold text-lg mb-2">🎮 Real-time</div>
                  <div>Multiplayer Snake gameplay with instant updates</div>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl border border-purple-400/30 backdrop-blur">
                  <div className="text-purple-400 font-bold text-lg mb-2">⛓️ Blockchain</div>
                  <div>Verified high scores on Monad network</div>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl border border-pink-400/30 backdrop-blur">
                  <div className="text-pink-400 font-bold text-lg mb-2">✨ ZK Proofs</div>
                  <div>Succinct-powered verification</div>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl border border-green-400/30 backdrop-blur">
                  <div className="text-green-400 font-bold text-lg mb-2">🏆 Compete</div>
                  <div>Global leaderboard with rankings</div>
                </div>
              </div>

              {/* Additional Succinct stickers showcase */}
              <div className="flex justify-center space-x-4 opacity-60">
                <img 
                  src="https://succinct-pfp-customize.vercel.app/stickers/crab_nerd.webp" 
                  alt="Succinct Crab" 
                  className="w-12 h-12 animate-bounce"
                />
                <img 
                  src="https://succinct-pfp-customize.vercel.app/stickers/4090_(1).webp" 
                  alt="Succinct" 
                  className="w-12 h-12 animate-pulse"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-gray-500 text-sm">
        <p>Built with ❤️ by dropxtor | Powered by Succinct Labs & Monad Network</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
