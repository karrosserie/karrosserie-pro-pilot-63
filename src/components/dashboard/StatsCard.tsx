
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconBg?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  iconBg = 'bg-karrosserie-orange'
}) => {
  return (
    <div className="card-container flex items-center animate-fade-in">
      <div className={`${iconBg} p-4 rounded-lg mr-4`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        
        {change && (
          <div className="flex items-center mt-1">
            <span 
              className={`text-xs font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change} {isPositive ? '↑' : '↓'}
            </span>
            <span className="text-xs text-gray-500 ml-1">ce mois</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
