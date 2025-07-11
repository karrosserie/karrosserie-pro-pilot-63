
import { useState, useRef, useCallback } from 'react';
import { Crop, PixelCrop } from 'react-image-crop';

export const useImageCropper = (imageUrl: string, onCropComplete: (blob: Blob) => void) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setImageDimensions({ width, height });
    
    const initialCrop: Crop = {
      unit: '%',
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    };
    
    setCrop(initialCrop);
  }, []);

  const getCroppedImage = useCallback((zoom: number, rotation: number) => {
    if (!imageRef.current || !completedCrop) return;

    setIsLoading(true);

    const image = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsLoading(false);
      return;
    }

    console.log('=== CROP DEBUG INFO ===');
    console.log('Completed crop:', completedCrop);
    console.log('Image natural size:', image.naturalWidth, 'x', image.naturalHeight);
    console.log('Image displayed size:', image.width, 'x', image.height);
    console.log('Current zoom:', zoom);
    console.log('Current rotation:', rotation);

    // Calcul correct des ratios d'échelle en tenant compte du zoom
    // Le zoom augmente la taille affichée, donc on doit diviser par le zoom pour retrouver la taille de base
    const baseDisplayedWidth = image.width;
    const baseDisplayedHeight = image.height;
    
    // Ratio entre la taille naturelle et la taille affichée de base (sans zoom)
    const scaleX = image.naturalWidth / baseDisplayedWidth;
    const scaleY = image.naturalHeight / baseDisplayedHeight;
    
    console.log('Scale ratios (natural/displayed):', { scaleX, scaleY });

    // Les coordonnées de crop sont basées sur l'image zoomée affichée
    // On doit les convertir vers les coordonnées naturelles
    const naturalCropX = completedCrop.x * scaleX;
    const naturalCropY = completedCrop.y * scaleY;
    const naturalCropWidth = completedCrop.width * scaleX;
    const naturalCropHeight = completedCrop.height * scaleY;

    console.log('Natural crop coordinates:', {
      x: naturalCropX,
      y: naturalCropY,
      width: naturalCropWidth,
      height: naturalCropHeight
    });

    const rotationInRadians = (rotation * Math.PI) / 180;
    const isRotated90or270 = rotation === 90 || rotation === 270;
    
    if (isRotated90or270) {
      canvas.width = naturalCropHeight;
      canvas.height = naturalCropWidth;
    } else {
      canvas.width = naturalCropWidth;
      canvas.height = naturalCropHeight;
    }

    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotationInRadians);

    ctx.drawImage(
      image,
      naturalCropX,
      naturalCropY,
      naturalCropWidth,
      naturalCropHeight,
      -naturalCropWidth / 2,
      -naturalCropHeight / 2,
      naturalCropWidth,
      naturalCropHeight
    );

    ctx.restore();

    console.log('=== END CROP DEBUG ===');

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
  }, [completedCrop, onCropComplete]);

  return {
    crop,
    setCrop,
    completedCrop,
    setCompletedCrop,
    imageDimensions,
    isLoading,
    imageRef,
    containerRef,
    onImageLoad,
    getCroppedImage
  };
};
