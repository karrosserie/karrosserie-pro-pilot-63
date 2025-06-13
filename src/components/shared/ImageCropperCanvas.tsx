
import React from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { createInitialCrop } from './utils/imageCropperUtils';

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

  return (
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
        className="max-w-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.3s ease-in-out'
        }}
      />
    </ReactCrop>
  );
};
