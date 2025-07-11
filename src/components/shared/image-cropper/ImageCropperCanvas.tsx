
import React from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperCanvasProps {
  imageUrl: string;
  crop: Crop | undefined;
  zoom: number;
  rotation: number;
  imageRef: React.RefObject<HTMLImageElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  onCropChange: (crop: Crop) => void;
  onCropComplete: (crop: PixelCrop) => void;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const ImageCropperCanvas: React.FC<ImageCropperCanvasProps> = ({
  imageUrl,
  crop,
  zoom,
  rotation,
  imageRef,
  containerRef,
  onCropChange,
  onCropComplete,
  onImageLoad
}) => {
  return (
    <div className="my-4 flex justify-center items-center" style={{ height: '70vh' }}>
      <div 
        ref={containerRef}
        className="relative overflow-hidden border border-gray-200 rounded-lg bg-gray-50"
        style={{ 
          width: '100%',
          height: '100%',
          maxWidth: '800px',
          maxHeight: '600px'
        }}
      >
        <div className="w-full h-full flex justify-center items-center">
          <ReactCrop
            crop={crop}
            onChange={onCropChange}
            onComplete={onCropComplete}
            className="flex justify-center items-center"
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Image à recadrer"
              onLoad={onImageLoad}
              className="block"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-in-out',
                maxWidth: '90%',
                maxHeight: '90%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </ReactCrop>
        </div>
      </div>
    </div>
  );
};
