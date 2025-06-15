
import { useState, useCallback } from 'react';
import { getMaxZoom } from '../utils/imageCropperUtils';

interface UseImageTransformationsProps {
  imageDimensions: { width: number; height: number };
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useImageTransformations = ({
  imageDimensions,
  containerRef
}: UseImageTransformationsProps) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoom = useCallback((direction: 'in' | 'out') => {
    const newZoom = direction === 'in' ? zoom * 1.1 : zoom / 1.1;
    const maxZoom = getMaxZoom(imageDimensions.width, imageDimensions.height, rotation, containerRef.current);
    const clampedZoom = Math.max(0.5, Math.min(maxZoom, newZoom));
    setZoom(clampedZoom);
  }, [zoom, imageDimensions, rotation, containerRef]);

  const handleRotation = useCallback((direction: 'cw' | 'ccw') => {
    const rotationStep = 90;
    const newRotation = direction === 'cw' 
      ? (rotation + rotationStep) % 360 
      : (rotation - rotationStep + 360) % 360;
    
    setRotation(newRotation);
    
    const maxZoom = getMaxZoom(imageDimensions.width, imageDimensions.height, newRotation, containerRef.current);
    if (zoom > maxZoom) {
      setZoom(maxZoom);
    }
  }, [rotation, zoom, imageDimensions, containerRef]);

  const maxZoom = getMaxZoom(imageDimensions.width, imageDimensions.height, rotation, containerRef.current);

  return {
    zoom,
    rotation,
    maxZoom,
    handleZoom,
    handleRotation
  };
};
