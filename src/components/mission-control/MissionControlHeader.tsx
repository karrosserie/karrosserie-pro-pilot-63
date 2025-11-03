import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const modes = [
    { key: 'super_admin', label: 'Super Admin' },
    { key: 'finance', label: 'Mode Finance' },
    { key: 'chef_equipe', label: 'Mode Chef d\'équipe' },
    { key: 'ouvrier', label: 'Mode Ouvrier' }
  ];

  const currentModeLabel = modes.find(mode => mode.key === selectedMode)?.label || 'Super Admin';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tour de contrôle</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm" 
            className={`text-xs px-2 sm:px-3 py-1 h-7 ${
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
            className={`text-xs px-2 sm:px-3 py-1 h-7 ${
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
            className={`text-xs px-2 sm:px-3 py-1 h-7 ${
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
      <div className="flex items-center gap-2 flex-wrap">
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <span className="hidden sm:inline">{currentModeLabel}</span>
              <span className="sm:hidden">{modes.find(mode => mode.key === selectedMode)?.label.split(' ')[0] || 'Admin'}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-48 z-[100]">
            {modes.map((mode) => (
              <DropdownMenuItem
                key={mode.key}
                onClick={() => onModeChange(mode.key as any)}
                className={selectedMode === mode.key ? 'bg-blue-50 text-blue-600 font-medium' : ''}
              >
                {mode.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MissionControlHeader;