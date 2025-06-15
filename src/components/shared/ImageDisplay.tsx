
import React, { useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';

interface ImageDisplayProps {
  imageUrl: string;
  zoom: number;
  rotation: number;
  crop?: Crop;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onCropChange: (c: Crop) => void;
  onCropComplete: (c: PixelCrop) => void;
}

export function ImageDisplay({
  imageUrl,
  zoom,
  rotation,
  crop,
  onImageLoad,
  onCropChange,
  onCropComplete
}: ImageDisplayProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <div className="my-4 flex justify-center items-center" style={{ height: '70vh' }}>
      <div 
        className="relative overflow-hidden border border-gray-200 rounded-lg"
        style={{ 
          width: '100%',
          height: '100%',
          maxWidth: '800px',
          maxHeight: '600px'
        }}
      >
        {(zoom !== 1 || rotation !== 0) ? (
          <div className="w-full h-full flex justify-center items-center">
            <img
              src={imageUrl}
              alt="Image à recadrer"
              className="max-w-full max-h-full object-contain"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-in-out',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded">
                Réinitialisez le zoom et la rotation pour pouvoir sélectionner une zone
              </div>
            </div>
          </div>
        ) : (
          <ReactCrop
            crop={crop}
            onChange={onCropChange}
            onComplete={onCropComplete}
            className="flex justify-center items-center w-full h-full"
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Image à recadrer"
              onLoad={onImageLoad}
              className="max-w-full max-h-full object-contain"
            />
          </ReactCrop>
        )}
      </div>
    </div>
  );
}
