import React from 'react';
import { Button } from '@/components/ui/button';

interface MissionControlHeaderProps {
  selectedPeriod: 'today' | 'week' | 'month';
  onPeriodChange: (period: 'today' | 'week' | 'month') => void;
  isAIOn: boolean;
  onAIToggle: () => void;
}

const MissionControlHeader: React.FC<MissionControlHeaderProps> = ({ 
  selectedPeriod, 
  onPeriodChange,
  isAIOn,
  onAIToggle
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Mission Control</h1>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className={`text-xs px-3 py-1 h-7 ${
              selectedPeriod === 'today' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onPeriodChange('today')}
          >
            Aujourd'hui
          </Button>
          <Button 
            size="sm" 
            className={`text-xs px-3 py-1 h-7 ${
              selectedPeriod === 'week' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onPeriodChange('week')}
          >
            Semaine
          </Button>
          <Button 
            size="sm" 
            className={`text-xs px-3 py-1 h-7 ${
              selectedPeriod === 'month' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onPeriodChange('month')}
          >
            Mois
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAIToggle}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer hover:opacity-90 ${
            isAIOn 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-400 text-white'
          }`}
        >
          {isAIOn ? 'IA ON' : 'IA OFF'}
        </button>
        <span className="text-sm font-medium text-gray-700">Super Admin</span>
      </div>
    </div>
  );
};

export default MissionControlHeader;