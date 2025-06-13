
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, RotateCw } from 'lucide-react';

interface ImageCropperControlsProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
}

export const ImageCropperControls = ({ onRotateLeft, onRotateRight }: ImageCropperControlsProps) => {
  return (
    <div className="mb-4 flex justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onRotateLeft}
        className="flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Pivoter à gauche
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRotateRight}
        className="flex items-center gap-2"
      >
        <RotateCw className="h-4 w-4" />
        Pivoter à droite
      </Button>
    </div>
  );
};
