
import React from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { createInitialCrop, getRotatedDimensions } from './utils/imageCropperUtils';

interface ImageCropperCanvasProps {
  imageUrl: string;
  crop: Crop | undefined;
  rotation: number;
  imageRef: React.RefObject<HTMLImageElement>;
  onCropChange: (c: Crop) => void;
  onCropComplete: (c: PixelCrop) => void;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const ImageCropperCanvas = ({
  imageUrl,
  crop,
  rotation,
  imageRef,
  onCropChange,
  onCropComplete,
  onImageLoad
}: ImageCropperCanvasProps) => {
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = createInitialCrop();
    onCropChange(initialCrop);
    onImageLoad(e);
  };

  // Calculer les dimensions du conteneur après rotation
  const getContainerStyle = () => {
    if (!imageRef.current) return {};
    
    const img = imageRef.current;
    const { width: rotatedWidth, height: rotatedHeight } = getRotatedDimensions(
      img.naturalWidth, 
      img.naturalHeight, 
      rotation
    );
    
    // Calculer le ratio pour adapter à la taille d'affichage
    const displayWidth = img.width;
    const displayHeight = img.height;
    const scaleX = displayWidth / img.naturalWidth;
    const scaleY = displayHeight / img.naturalHeight;
    
    return {
      width: `${rotatedWidth * scaleX}px`,
      height: `${rotatedHeight * scaleY}px`,
      maxWidth: '100%',
      maxHeight: '70vh',
      overflow: 'visible'
    };
  };

  return (
    <div className="flex justify-center items-center">
      <div style={getContainerStyle()}>
        <ReactCrop
          crop={crop}
          onChange={onCropChange}
          onComplete={onCropComplete}
          className="max-w-full"
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Image à recadrer"
            onLoad={handleImageLoad}
            className="max-w-full block"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease-in-out',
              transformOrigin: 'center center'
            }}
          />
        </ReactCrop>
      </div>
    </div>
  );
};
