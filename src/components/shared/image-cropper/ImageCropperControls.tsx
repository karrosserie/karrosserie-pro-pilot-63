
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';

interface ImageCropperControlsProps {
  zoom: number;
  maxZoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateClockwise: () => void;
  onRotateCounterClockwise: () => void;
}

export const ImageCropperControls: React.FC<ImageCropperControlsProps> = ({
  zoom,
  maxZoom,
  onZoomIn,
  onZoomOut,
  onRotateClockwise,
  onRotateCounterClockwise
}) => {
  return (
    <div className="flex justify-center gap-2 mb-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        disabled={zoom <= 0.5}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        disabled={zoom >= maxZoom}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRotateCounterClockwise}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRotateClockwise}
      >
        <RotateCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
