
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';

interface CropControlsProps {
  zoom: number;
  onZoom: (direction: 'in' | 'out') => void;
  onRotation: (direction: 'cw' | 'ccw') => void;
}

export function CropControls({ zoom, onZoom, onRotation }: CropControlsProps) {
  return (
    <div className="flex justify-center gap-2 mb-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onZoom('out')}
        disabled={zoom <= 0.5}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onZoom('in')}
        disabled={zoom >= 3}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onRotation('ccw')}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onRotation('cw')}
      >
        <RotateCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
