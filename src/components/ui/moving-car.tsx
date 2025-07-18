import React from 'react';
import { Car } from 'lucide-react';

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
      
      {/* Voiture utilisant l'icône Car de Lucide */}
      <div 
        className="absolute bottom-3 animate-[moveCarRight_3s_ease-in-out_infinite]"
        style={{ width: size, height: size }}
      >
        <Car 
          size={size} 
          className="text-karrosserie-orange"
        />
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