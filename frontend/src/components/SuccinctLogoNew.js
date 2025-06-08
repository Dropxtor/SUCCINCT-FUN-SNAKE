import React, { useState, useEffect } from 'react';

// Real Succinct logo component based on the provided image
const SuccinctLogoNew = ({ size = 'large', animated = true, className = '' }) => {
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
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  // SVG representation of the real Succinct logo
  const SuccinctSVG = ({ className: svgClassName = '' }) => (
    <svg 
      viewBox="0 0 100 100" 
      className={`${svgClassName}`}
      style={{
        filter: glitchActive 
          ? 'drop-shadow(0 0 10px #8b5cf6) drop-shadow(0 0 20px #ec4899)' 
          : 'drop-shadow(0 0 5px rgba(139, 92, 246, 0.5))'
      }}
    >
      {/* Outer ring */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="url(#succinct-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={glitchActive ? "10 5" : "none"}
        className={animated ? 'animate-pulse' : ''}
      />
      
      {/* Inner geometric pattern - representing the Succinct logo */}
      <g transform="translate(50,50)">
        {/* Central S-like shape */}
        <path
          d="M -15,-20 Q -25,-20 -25,-10 Q -25,0 -15,0 Q 15,0 15,10 Q 15,20 25,20"
          fill="none"
          stroke="url(#succinct-gradient-2)"
          strokeWidth="4"
          strokeLinecap="round"
          className={glitchActive ? 'animate-ping' : ''}
        />
        
        {/* Accent dots */}
        <circle cx="-20" cy="-15" r="2" fill="#8b5cf6" className="animate-pulse" />
        <circle cx="20" cy="15" r="2" fill="#ec4899" className="animate-pulse" />
        <circle cx="0" cy="0" r="3" fill="#06b6d4" className={animated ? 'animate-ping' : ''} />
        
        {/* Additional geometric elements */}
        <polygon
          points="-10,-15 -5,-25 0,-15"
          fill="url(#succinct-gradient-3)"
          opacity="0.8"
          className={animated ? 'animate-bounce' : ''}
        />
        <polygon
          points="10,15 5,25 0,15"
          fill="url(#succinct-gradient-3)"
          opacity="0.8"
          className={animated ? 'animate-bounce' : ''}
          style={{ animationDelay: '0.5s' }}
        />
      </g>
      
      {/* Gradients */}
      <defs>
        <linearGradient id="succinct-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="succinct-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <radialGradient id="succinct-gradient-3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </radialGradient>
      </defs>
    </svg>
  );

  return (
    <div className={`${sizeClasses[size]} relative ${className} ${animated ? 'succinct-logo-container' : ''}`}>
      <div 
        className="w-full h-full"
        style={{
          transform: animated ? `rotate(${rotationAngle}deg)` : 'none',
        }}
      >
        <SuccinctSVG className="w-full h-full" />
      </div>

      {/* Pulsing ring effects */}
      {animated && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-ping opacity-20"></div>
          <div 
            className="absolute inset-0 rounded-full border border-cyan-400 opacity-30 animate-spin"
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

// Snake segment with Succinct logo
export const SuccinctSnakeSegment = ({ isHead = false, size = 20, className = '' }) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {isHead ? (
        <SuccinctLogoNew size="small" animated={false} className="w-full h-full" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-sm border border-cyan-400/50">
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-sm scale-75 flex items-center justify-center">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccinctLogoNew;