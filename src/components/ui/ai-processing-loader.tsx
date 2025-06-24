
import React from 'react';
import { CircularProgress } from './circular-progress';
import { Loader2, Brain } from 'lucide-react';

interface AIProcessingLoaderProps {
  progress: number;
  message?: string;
  className?: string;
}

export const AIProcessingLoader: React.FC<AIProcessingLoaderProps> = ({
  progress,
  message = "Analyse IA en cours...",
  className
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-4 ${className}`}>
      <div className="relative">
        <CircularProgress progress={progress} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Brain className="h-6 w-6 text-karrosserie-orange animate-pulse" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-gray-700">{message}</p>
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Extraction des données en cours...</span>
        </div>
      </div>
    </div>
  );
};
