import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface MissionControlHeaderProps {
  selectedPeriod: 'today' | 'week' | 'month';
  onPeriodChange: (period: 'today' | 'week' | 'month') => void;
  isAIOn: boolean;
  onAIToggle: () => void;
  selectedMode: 'super_admin' | 'finance' | 'chef_equipe' | 'ouvrier';
  onModeChange: (mode: 'super_admin' | 'finance' | 'chef_equipe' | 'ouvrier') => void;
}

const MissionControlHeader: React.FC<MissionControlHeaderProps> = ({ 
  selectedPeriod, 
  onPeriodChange,
  isAIOn,
  onAIToggle,
  selectedMode,
  onModeChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const modes = [
    { key: 'super_admin', label: 'Super Admin' },
    { key: 'finance', label: 'Mode Finance' },
    { key: 'chef_equipe', label: 'Mode Chef d\'équipe' },
    { key: 'ouvrier', label: 'Mode Ouvrier' }
  ];

  const currentModeLabel = modes.find(mode => mode.key === selectedMode)?.label || 'Super Admin';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Tour de contrôle</h1>
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
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            <span>{currentModeLabel}</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {modes.map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => {
                    onModeChange(mode.key as any);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    selectedMode === mode.key ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionControlHeader;