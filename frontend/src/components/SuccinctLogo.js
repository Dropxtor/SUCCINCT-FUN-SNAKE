import React, { useState, useEffect } from 'react';

const SuccinctLogo = ({ size = 'large', animated = true, className = '' }) => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Periodic glitch effect
  useEffect(() => {
    if (!animated) return;
    
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(glitchInterval);
  }, [animated]);

  // Continuous rotation
  useEffect(() => {
    if (!animated) return;
    
    const rotationInterval = setInterval(() => {
      setRotationAngle(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(rotationInterval);
  }, [animated]);

  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-lg',
    large: 'w-16 h-16 text-2xl',
    xlarge: 'w-24 h-24 text-4xl'
  };

  const baseClasses = `
    ${sizeClasses[size]} 
    rounded-full 
    flex items-center justify-center 
    font-bold text-white 
    relative overflow-hidden
    ${className}
  `;

  const gradientStyle = glitchActive 
    ? 'from-red-500 via-yellow-400 to-purple-500' 
    : 'from-purple-500 via-pink-500 to-cyan-500';

  return (
    <div className={`${baseClasses} ${animated ? 'succinct-logo-container' : ''}`}>
      {/* Main logo */}
      <div 
        className={`
          w-full h-full rounded-full 
          bg-gradient-to-r ${gradientStyle}
          flex items-center justify-center
          transition-all duration-200
          ${glitchActive ? 'animate-pulse scale-110' : ''}
          ${animated ? 'hover:scale-105 cursor-pointer' : ''}
        `}
        style={{
          transform: animated ? `rotate(${rotationAngle}deg)` : 'none',
          boxShadow: glitchActive 
            ? '0 0 30px rgba(255, 0, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.6)' 
            : '0 0 20px rgba(139, 92, 246, 0.5)'
        }}
      >
        <span 
          className={`succinct-font ${glitchActive ? 'text-black' : 'text-white'}`}
          style={{
            transform: animated ? `rotate(-${rotationAngle}deg)` : 'none',
            textShadow: glitchActive ? '2px 2px 0px cyan, -2px -2px 0px magenta' : 'none'
          }}
        >
          S
        </span>
      </div>

      {/* Pulsing ring effects */}
      {animated && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-ping opacity-20"></div>
          <div 
            className="absolute inset-0 rounded-full border-2 border-cyan-400 opacity-30 animate-spin"
            style={{ animationDuration: '3s' }}
          ></div>
        </>
      )}

      {/* Floating particles */}
      {animated && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${20 + (i * 10)}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

// Succinct-themed decorative elements
export const SuccinctOrb = ({ className = '', size = 'medium' }) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }, 2000 + Math.random() * 3000);
    
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-r from-purple-400 to-pink-400 
        ${pulse ? 'animate-ping scale-150' : 'animate-pulse'} 
        ${className}
      `}
      style={{
        boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)'
      }}
    ></div>
  );
};

// Snake-themed Succinct logo
export const SuccinctSnakeLogo = ({ className = '' }) => {
  const [snakePosition, setSnakePosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnakePosition(prev => (prev + 1) % 100);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-32 h-8 ${className}`}>
      {/* Snake trail */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 opacity-30"></div>
      
      {/* Snake head */}
      <div 
        className="absolute w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs"
        style={{
          left: `${snakePosition}%`,
          top: '50%',
          transform: 'translateY(-50%)',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.8)'
        }}
      >
        S
      </div>
      
      {/* Glowing trail */}
      <div 
        className="absolute w-4 h-4 rounded-full bg-cyan-400 opacity-60"
        style={{
          left: `${(snakePosition - 10 + 100) % 100}%`,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      ></div>
      <div 
        className="absolute w-3 h-3 rounded-full bg-purple-400 opacity-40"
        style={{
          left: `${(snakePosition - 20 + 100) % 100}%`,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      ></div>
    </div>
  );
};

export default SuccinctLogo;