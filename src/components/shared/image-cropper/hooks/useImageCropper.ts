
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

    // Calculer la taille réelle de l'image affichée avec le zoom
    const displayedWidth = image.width * zoom;
    const displayedHeight = image.height * zoom;
    
    // Calculer l'offset de centrage dans le conteneur ReactCrop
    const container = imageRef.current.parentElement;
    if (!container) {
      setIsLoading(false);
      return;
    }
    
    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    
    // Offset de l'image par rapport au conteneur (due au centrage)
    const offsetX = (containerRect.width - displayedWidth) / 2;
    const offsetY = (containerRect.height - displayedHeight) / 2;
    
    console.log('Container size:', containerRect.width, 'x', containerRect.height);
    console.log('Displayed image size with zoom:', displayedWidth, 'x', displayedHeight);
    console.log('Centering offset:', offsetX, 'x', offsetY);

    // Ajuster les coordonnées de crop en tenant compte de l'offset de centrage
    let adjustedCropX = completedCrop.x - offsetX;
    let adjustedCropY = completedCrop.y - offsetY;
    let adjustedCropWidth = completedCrop.width;
    let adjustedCropHeight = completedCrop.height;
    
    // Transformer les coordonnées de crop en fonction de la rotation
    if (rotation !== 0) {
      const centerX = displayedWidth / 2;
      const centerY = displayedHeight / 2;
      
      // Coordonnées relatives au centre de l'image
      const relativeX = adjustedCropX - centerX;
      const relativeY = adjustedCropY - centerY;
      
      // Point du coin inférieur droit du crop
      const relativeX2 = (adjustedCropX + adjustedCropWidth) - centerX;
      const relativeY2 = (adjustedCropY + adjustedCropHeight) - centerY;
      
      const rotationInRadians = (-rotation * Math.PI) / 180; // Rotation inverse
      
      // Transformer les coordonnées avec la rotation inverse
      const transformedX = relativeX * Math.cos(rotationInRadians) - relativeY * Math.sin(rotationInRadians);
      const transformedY = relativeX * Math.sin(rotationInRadians) + relativeY * Math.cos(rotationInRadians);
      
      const transformedX2 = relativeX2 * Math.cos(rotationInRadians) - relativeY2 * Math.sin(rotationInRadians);
      const transformedY2 = relativeX2 * Math.sin(rotationInRadians) + relativeY2 * Math.cos(rotationInRadians);
      
      // Revenir aux coordonnées absolues
      const finalX = transformedX + centerX;
      const finalY = transformedY + centerY;
      const finalX2 = transformedX2 + centerX;
      const finalY2 = transformedY2 + centerY;
      
      // Calculer la nouvelle zone de crop (prendre le rectangle englobant)
      adjustedCropX = Math.min(finalX, finalX2);
      adjustedCropY = Math.min(finalY, finalY2);
      adjustedCropWidth = Math.abs(finalX2 - finalX);
      adjustedCropHeight = Math.abs(finalY2 - finalY);
      
      console.log('Rotation-adjusted crop:', {
        x: adjustedCropX,
        y: adjustedCropY,
        width: adjustedCropWidth,
        height: adjustedCropHeight
      });
    }
    
    // Ratio entre la taille naturelle et la taille affichée avec zoom
    const scaleX = image.naturalWidth / displayedWidth;
    const scaleY = image.naturalHeight / displayedHeight;
    
    console.log('Scale ratios (natural/displayed with zoom):', { scaleX, scaleY });

    // Convertir vers les coordonnées naturelles
    const naturalCropX = Math.max(0, adjustedCropX * scaleX);
    const naturalCropY = Math.max(0, adjustedCropY * scaleY);
    const naturalCropWidth = Math.min(adjustedCropWidth * scaleX, image.naturalWidth - naturalCropX);
    const naturalCropHeight = Math.min(adjustedCropHeight * scaleY, image.naturalHeight - naturalCropY);

    console.log('Adjusted crop coordinates:', {
      x: adjustedCropX,
      y: adjustedCropY,
      width: completedCrop.width,
      height: completedCrop.height
    });
    
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
