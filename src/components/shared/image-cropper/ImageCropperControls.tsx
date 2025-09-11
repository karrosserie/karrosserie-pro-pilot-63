
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
  const handleZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onZoomOut();
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onZoomIn();
  };

  const handleRotateCounterClockwise = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRotateCounterClockwise();
  };

  const handleRotateClockwise = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRotateClockwise();
  };

  return (
    <div className="flex justify-center gap-2 mb-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= 0.5}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleZoomIn}
        disabled={zoom >= maxZoom}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleRotateCounterClockwise}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleRotateClockwise}
      >
        <RotateCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
