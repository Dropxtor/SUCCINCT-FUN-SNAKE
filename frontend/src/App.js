import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SnakeGame from "./components/SnakeGame";
import WalletConnect from "./components/WalletConnect";
import Leaderboard from "./components/Leaderboard";

const Home = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);

  // Periodic glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 150);
    }, 8000 + Math.random() * 5000);
    
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
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className={`relative z-10 p-6 ${showGlitch ? 'animate-pulse' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className={`text-6xl font-bold mb-4 ${showGlitch ? 'text-red-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400'} transition-all duration-300`}>
              SNAKE BLOCKCHAIN
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Real-time multiplayer Snake powered by Succinct
            </p>
            <div className="flex justify-center items-center space-x-2 text-sm text-gray-400">
              <span>Created by</span>
              <a 
                href="https://x.com/0xDropxtor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
              >
                dropxtor
              </a>
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
              <SnakeGame 
                walletAddress={walletAddress}
                onGameEnd={handleGameEnd}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg border border-gray-600">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">PLAYER STATS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wallet:</span>
                    <span className="text-white font-mono text-sm">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-green-400">Sepolia Testnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Score:</span>
                    <span className="text-cyan-400 font-bold">{currentScore}</span>
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <Leaderboard 
                currentScore={currentScore}
                walletAddress={walletAddress}
              />

              {/* Game Info */}
              <div className="bg-gradient-to-b from-purple-900 to-black p-6 rounded-lg border border-purple-400">
                <h3 className="text-xl font-bold text-purple-400 mb-4">GAME FEATURES</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>Real-time multiplayer</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Blockchain score storage</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span>Glitchy neon aesthetics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Succinct SP1 integration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">🐍</div>
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to Snake Blockchain</h2>
              <p className="text-gray-400 mb-8">
                The first real-time multiplayer Snake game powered by Succinct blockchain technology. 
                Connect your wallet to start playing and competing for the top spot on the leaderboard!
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-cyan-400 font-bold">🎮 Real-time</div>
                  <div>Multiplayer gameplay</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-purple-400 font-bold">⛓️ Blockchain</div>
                  <div>Verified high scores</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-pink-400 font-bold">✨ Glitchy</div>
                  <div>Neon aesthetics</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-green-400 font-bold">🏆 Compete</div>
                  <div>Global leaderboard</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
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
