
import { useState, useRef } from 'react';
import { Crop, PixelCrop } from 'react-image-crop';
import { getRotatedDimensions } from '../utils/imageCropperUtils';

export const useImageCropper = (onCropComplete: (blob: Blob) => void) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const getCroppedImage = (rotation: number) => {
    if (!imageRef.current || !completedCrop) return;

    setIsLoading(true);

    const image = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsLoading(false);
      return;
    }

    const rotRad = (rotation * Math.PI) / 180;
    const { width: bBoxWidth, height: bBoxHeight } = getRotatedDimensions(
      image.width,
      image.height,
      rotation
    );

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) {
      setIsLoading(false);
      return;
    }

    tempCanvas.width = bBoxWidth;
    tempCanvas.height = bBoxHeight;

    tempCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
    tempCtx.rotate(rotRad);
    tempCtx.scale(1, 1);
    tempCtx.translate(-image.width / 2, -image.height / 2);
    tempCtx.drawImage(image, 0, 0);

    const scaleX = image.naturalWidth / bBoxWidth;
    const scaleY = image.naturalHeight / bBoxHeight;

    ctx.drawImage(
      tempCanvas,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob(
      (blob) => {
        setIsLoading(false);
        if (blob) {
          onCropComplete(blob);
        }
      },
      'image/jpeg',
      0.95
    );
  };

  return {
    crop,
    setCrop,
    completedCrop,
    setCompletedCrop,
    isLoading,
    imageRef,
    getCroppedImage
  };
};
