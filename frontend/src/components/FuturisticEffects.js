import React, { useEffect, useState, useRef } from 'react';

// Holographic scanning effect
export const HolographicScanner = ({ children, className = '' }) => {
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 200);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <div 
        className="absolute top-0 w-2 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 pointer-events-none"
        style={{
          left: `${scanPosition}%`,
          transform: 'translateX(-50%)',
          boxShadow: '0 0 20px cyan'
        }}
      ></div>
    </div>
  );
};

// Matrix-style digital rain
export const DigitalRain = ({ className = '' }) => {
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const drops = [];

    for (let x = 0; x < canvas.width / 10; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      if (!isActive) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#8b5cf6';
      ctx.font = '10px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * 10, drops[i] * 10);

        if (drops[i] * 10 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none opacity-20 ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

// Floating geometric shapes
export const FloatingGeometry = ({ className = '' }) => {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    const createShape = () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10,
      rotation: Math.random() * 360,
      speed: Math.random() * 2 + 0.5,
      type: ['triangle', 'square', 'hexagon'][Math.floor(Math.random() * 3)],
      color: ['purple', 'pink', 'cyan', 'blue'][Math.floor(Math.random() * 4)]
    });

    const initialShapes = Array.from({ length: 8 }, createShape);
    setShapes(initialShapes);

    const interval = setInterval(() => {
      setShapes(prev => 
        prev.map(shape => ({
          ...shape,
          y: (shape.y - shape.speed + 100) % 100,
          rotation: (shape.rotation + 1) % 360
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getShapeStyles = (shape) => ({
    left: `${shape.x}%`,
    top: `${shape.y}%`,
    width: `${shape.size}px`,
    height: `${shape.size}px`,
    transform: `rotate(${shape.rotation}deg)`,
    '--shape-color': shape.color === 'purple' ? '#8b5cf6' : 
                     shape.color === 'pink' ? '#ec4899' : 
                     shape.color === 'cyan' ? '#06b6d4' : '#3b82f6'
  });

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: 2 }}>
      {shapes.map(shape => (
        <div
          key={shape.id}
          className="absolute opacity-30 animate-pulse"
          style={getShapeStyles(shape)}
        >
          {shape.type === 'triangle' && (
            <div 
              className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent"
              style={{ 
                borderBottomColor: 'var(--shape-color)',
                filter: 'drop-shadow(0 0 10px var(--shape-color))'
              }}
            ></div>
          )}
          {shape.type === 'square' && (
            <div 
              className="w-full h-full border-2"
              style={{ 
                borderColor: 'var(--shape-color)',
                filter: 'drop-shadow(0 0 10px var(--shape-color))'
              }}
            ></div>
          )}
          {shape.type === 'hexagon' && (
            <div 
              className="w-full h-full"
              style={{ 
                background: 'var(--shape-color)',
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                filter: 'drop-shadow(0 0 10px var(--shape-color))'
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

// Cyberpunk grid overlay
export const CyberGrid = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: 1 }}>
      <div 
        className="w-full h-full opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-pulse 4s ease-in-out infinite'
        }}
      ></div>
    </div>
  );
};

// Futuristic loading animation
export const FuturisticLoader = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      <div className="absolute inset-0 rounded-full border-2 border-purple-500 animate-spin"></div>
      <div className="absolute inset-2 rounded-full border-2 border-pink-500 animate-spin-reverse"></div>
      <div className="absolute inset-4 rounded-full border-2 border-cyan-500 animate-pulse"></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-20 animate-ping"></div>
    </div>
  );
};

// Neural network connections
export const NeuralNetwork = ({ className = '' }) => {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const createConnection = () => ({
      id: Math.random(),
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
      intensity: Math.random(),
      speed: Math.random() * 0.02 + 0.01
    });

    const initialConnections = Array.from({ length: 15 }, createConnection);
    setConnections(initialConnections);

    const interval = setInterval(() => {
      setConnections(prev => 
        prev.map(conn => ({
          ...conn,
          intensity: Math.sin(Date.now() * conn.speed) * 0.5 + 0.5
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: 1 }}>
      <svg className="w-full h-full opacity-20">
        {connections.map(conn => (
          <line
            key={conn.id}
            x1={`${conn.x1}%`}
            y1={`${conn.y1}%`}
            x2={`${conn.x2}%`}
            y2={`${conn.y2}%`}
            stroke={`rgba(139, 92, 246, ${conn.intensity})`}
            strokeWidth="1"
            style={{
              filter: `drop-shadow(0 0 5px rgba(139, 92, 246, ${conn.intensity}))`
            }}
          />
        ))}
        {connections.map(conn => (
          <circle
            key={`node-${conn.id}`}
            cx={`${conn.x1}%`}
            cy={`${conn.y1}%`}
            r="2"
            fill={`rgba(6, 182, 212, ${conn.intensity})`}
            style={{
              filter: `drop-shadow(0 0 5px rgba(6, 182, 212, ${conn.intensity}))`
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// Holographic text effect
export const HolographicText = ({ children, className = '' }) => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`${glitch ? 'animate-pulse' : ''}`}
        style={{
          textShadow: glitch 
            ? '0 0 5px #8b5cf6, 0 0 10px #ec4899, 0 0 15px #06b6d4' 
            : '0 0 10px rgba(139, 92, 246, 0.5)'
        }}
      >
        {children}
      </div>
      {glitch && (
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            animation: 'holographic-scan 0.5s ease-in-out'
          }}
        ></div>
      )}
    </div>
  );
};

export default {
  HolographicScanner,
  DigitalRain,
  FloatingGeometry,
  CyberGrid,
  FuturisticLoader,
  NeuralNetwork,
  HolographicText
};