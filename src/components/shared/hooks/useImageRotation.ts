
import { useState } from 'react';
import { Crop } from 'react-image-crop';
import { createInitialCrop } from '../utils/imageCropperUtils';

export const useImageRotation = (setCrop: (crop: Crop) => void) => {
  const [rotation, setRotation] = useState(0);

  const adjustCropAfterRotation = () => {
    const newCrop = createInitialCrop();
    setCrop(newCrop);
  };

  const rotateImage = (degrees: number) => {
    setRotation(prev => (prev + degrees) % 360);
    setTimeout(() => {
      adjustCropAfterRotation();
    }, 100);
  };

  return {
    rotation,
    rotateImage,
    setRotation
  };
};
