import React, { useState, useEffect } from 'react';
import { HolographicText, FuturisticLoader } from './FuturisticEffects';

// Futuristic button component
export const FuturisticButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  size = 'medium',
  className = '' 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (disabled) return;
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
    
    onClick && onClick(e);
  };

  const variantClasses = {
    primary: 'from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500',
    secondary: 'from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800',
    danger: 'from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:via-red-600 hover:to-red-700'
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden
        ${sizeClasses[size]}
        bg-gradient-to-r ${variantClasses[variant]}
        text-white font-bold rounded-xl
        transform transition-all duration-200
        ${isPressed ? 'scale-95' : 'hover:scale-105'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        shadow-lg hover:shadow-xl
        border border-purple-400/30
        ${className}
      `}
      style={{
        boxShadow: isPressed 
          ? 'inset 0 0 20px rgba(139, 92, 246, 0.5)' 
          : '0 0 20px rgba(139, 92, 246, 0.3)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute bg-white rounded-full opacity-30 animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        ></div>
      ))}
      
      {/* Content */}
      <span className="relative z-10 succinct-font">
        {disabled && variant === 'primary' ? (
          <div className="flex items-center space-x-2">
            <FuturisticLoader size="small" />
            <span>LOADING...</span>
          </div>
        ) : (
          children
        )}
      </span>
      
      {/* Holographic scan line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transform -skew-x-12 translate-x-full hover:-translate-x-full transition-transform duration-1000"></div>
    </button>
  );
};

// Futuristic input field
export const FuturisticInput = ({ 
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  className = '' 
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2 succinct-font">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 py-3 
            bg-gray-900/50 border-2 rounded-lg
            ${focused ? 'border-purple-400' : 'border-gray-600'}
            text-white placeholder-gray-400
            focus:outline-none focus:ring-0
            transition-all duration-300
            backdrop-blur-md
          `}
          style={{
            boxShadow: focused 
              ? '0 0 20px rgba(139, 92, 246, 0.3)' 
              : 'none'
          }}
        />
        
        {/* Animated border glow */}
        {focused && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-20 animate-pulse pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};

// Futuristic card component
export const FuturisticCard = ({ 
  children, 
  title,
  className = '',
  glowing = false,
  animated = true 
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className={`
        relative p-6 rounded-xl
        bg-gradient-to-br from-gray-900/80 via-purple-900/20 to-gray-900/80
        border border-purple-500/30
        backdrop-blur-md
        ${animated ? 'transform transition-all duration-300 hover:scale-105' : ''}
        ${glowing ? 'shadow-lg shadow-purple-500/25' : ''}
        ${className}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: hovered 
          ? '0 0 30px rgba(139, 92, 246, 0.4)' 
          : glowing 
            ? '0 0 20px rgba(139, 92, 246, 0.2)' 
            : 'none'
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 rounded-xl opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(139, 92, 246, 0.1) 10px,
                rgba(139, 92, 246, 0.1) 20px
              )
            `,
            animation: hovered ? 'pattern-shift 2s linear infinite' : 'none'
          }}
        ></div>
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400 opacity-50"></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400 opacity-50"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400 opacity-50"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400 opacity-50"></div>
      
      {/* Title */}
      {title && (
        <div className="mb-4">
          <HolographicText>
            <h3 className="text-xl font-bold text-cyan-400 succinct-font">
              {title}
            </h3>
          </HolographicText>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Scanning line effect */}
      {hovered && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
            animation: 'scan-line 2s ease-in-out infinite'
          }}
        ></div>
      )}
    </div>
  );
};

// Futuristic progress bar
export const FuturisticProgress = ({ 
  value, 
  max = 100, 
  label = '', 
  className = '' 
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`${className}`}>
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-300 succinct-font">{label}</span>
          <span className="text-sm text-cyan-400 succinct-font">{value}/{max}</span>
        </div>
      )}
      <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
        {/* Progress fill */}
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-500 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
        </div>
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 6px)'
          }}
        ></div>
      </div>
    </div>
  );
};

export default {
  FuturisticButton,
  FuturisticInput,
  FuturisticCard,
  FuturisticProgress
};