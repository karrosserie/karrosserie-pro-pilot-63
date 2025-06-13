
import { useState } from 'react';

export function useImageRotation() {
  const [rotation, setRotation] = useState(0);

  const rotateImage = (degrees: number) => {
    setRotation(prev => (prev + degrees) % 360);
  };

  const resetRotation = () => {
    setRotation(0);
  };

  return {
    rotation,
    rotateImage,
    resetRotation
  };
}
