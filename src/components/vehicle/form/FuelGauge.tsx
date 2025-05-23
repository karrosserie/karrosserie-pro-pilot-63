
import React from 'react';
import { Fuel } from 'lucide-react';

interface FuelGaugeProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const FuelGauge: React.FC<FuelGaugeProps> = ({ value, onChange, disabled = false }) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  // Create gauge marks
  const marks = [];
  for (let i = 0; i <= 8; i++) {
    const angle = -90 + (i * 22.5); // From -90° to 90°
    const isQuarter = i % 2 === 0;
    const length = isQuarter ? 15 : 10;
    const color = i <= 2 ? '#ef4444' : i <= 4 ? '#f97316' : '#22c55e';
    
    marks.push(
      <line
        key={i}
        x1="50"
        y1="15"
        x2="50"
        y2={15 + length}
        stroke={color}
        strokeWidth={isQuarter ? 3 : 2}
        transform={`rotate(${angle} 50 50)`}
      />
    );
  }

  // Needle angle calculation
  const needleAngle = -90 + (value / 100) * 180;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <svg width="120" height="80" viewBox="0 0 100 60">
          {/* Gauge background arc */}
          <path
            d="M 15 50 A 35 35 0 0 1 85 50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Fuel level arc */}
          <path
            d="M 15 50 A 35 35 0 0 1 85 50"
            fill="none"
            stroke={value <= 25 ? '#ef4444' : value <= 50 ? '#f97316' : '#22c55e'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 110} 110`}
          />
          
          {/* Gauge marks */}
          {marks}
          
          {/* Center dot */}
          <circle cx="50" cy="50" r="3" fill="#374151" />
          
          {/* Needle */}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="20"
            stroke="#374151"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${needleAngle} 50 50)`}
          />
          
          {/* Fuel icon */}
          <g transform="translate(42, 35)">
            <Fuel size={16} className="text-gray-600" />
          </g>
        </svg>
        
        {/* Labels */}
        <div className="absolute bottom-0 left-0 text-xs text-gray-500">E</div>
        <div className="absolute bottom-0 right-0 text-xs text-gray-500">F</div>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
          {Math.round(value)}%
        </div>
      </div>
      
      {/* Slider control */}
      <div className="w-full max-w-xs">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleSliderChange}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, 
              #ef4444 0%, #ef4444 25%, 
              #f97316 25%, #f97316 50%, 
              #22c55e 50%, #22c55e 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Vide</span>
          <span>1/4</span>
          <span>1/2</span>
          <span>3/4</span>
          <span>Plein</span>
        </div>
      </div>
    </div>
  );
};

export default FuelGauge;
