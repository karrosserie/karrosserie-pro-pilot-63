import React from 'react';

interface MovingCarProps {
  className?: string;
  size?: number;
}

export const MovingCar: React.FC<MovingCarProps> = ({ 
  className = "", 
  size = 48 
}) => {
  return (
    <div className={`relative ${className}`} style={{ width: size * 2, height: size }}>
      {/* Route */}
      <div 
        className="absolute bottom-2 w-full h-1 bg-gray-300 rounded"
        style={{ width: size * 2 }}
      >
        <div className="h-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded animate-pulse"></div>
      </div>
      
      {/* Voiture */}
      <div 
        className="absolute bottom-3 animate-[moveCarRight_3s_ease-in-out_infinite]"
        style={{ width: size, height: size * 0.6 }}
      >
        <svg 
          width={size} 
          height={size * 0.6} 
          viewBox="0 0 100 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Corps de la voiture */}
          <rect x="10" y="25" width="70" height="20" rx="5" fill="hsl(var(--primary))" />
          <rect x="20" y="15" width="50" height="15" rx="8" fill="hsl(var(--primary))" />
          
          {/* Fenêtres */}
          <rect x="25" y="18" width="15" height="10" rx="2" fill="hsl(var(--background))" opacity="0.8" />
          <rect x="50" y="18" width="15" height="10" rx="2" fill="hsl(var(--background))" opacity="0.8" />
          
          {/* Roues */}
          <circle cx="25" cy="45" r="8" fill="hsl(var(--muted-foreground))" className="animate-spin" />
          <circle cx="25" cy="45" r="4" fill="hsl(var(--background))" />
          <circle cx="65" cy="45" r="8" fill="hsl(var(--muted-foreground))" className="animate-spin" />
          <circle cx="65" cy="45" r="4" fill="hsl(var(--background))" />
          
          {/* Phares */}
          <circle cx="85" cy="30" r="3" fill="hsl(var(--accent))" opacity="0.8" />
          <circle cx="85" cy="38" r="3" fill="hsl(var(--accent))" opacity="0.8" />
          
          {/* Détails */}
          <rect x="75" y="28" width="8" height="12" rx="2" fill="hsl(var(--primary))" opacity="0.9" />
        </svg>
      </div>
      
      <style>{`
        @keyframes moveCarRight {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(calc(100% + ${size}px));
          }
          51% {
            transform: translateX(calc(100% + ${size}px)) scaleX(-1);
          }
          100% {
            transform: translateX(-100%) scaleX(-1);
          }
        }
      `}</style>
    </div>
  );
};