
import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, RotateCcw, RotateCw } from 'lucide-react';
import { useImageRotation } from './hooks/useImageRotation';
import { getCroppedImageBlob } from './utils/imageCropperUtils';

interface ImageCropperProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number;
  allowHorizontalExpansion?: boolean;
}

export function ImageCropper({
  open,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio,
  allowHorizontalExpansion = false
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isLoading, setIsLoading] = useState(false);
  const [containerHeight, setContainerHeight] = useState(600);
  const imageRef = useRef<HTMLImageElement>(null);
  const { rotation, rotateImage, resetRotation } = useImageRotation();

  // Largeur fixe du conteneur (largeur maximale de la fenêtre)
  const containerWidth = 800;

  // Calculer les dimensions de l'image après rotation
  const calculateRotatedDimensions = (naturalWidth: number, naturalHeight: number, rotation: number) => {
    const rotRad = Math.abs((rotation * Math.PI) / 180);
    const rotatedWidth = Math.abs(Math.cos(rotRad) * naturalWidth) + Math.abs(Math.sin(rotRad) * naturalHeight);
    const rotatedHeight = Math.abs(Math.sin(rotRad) * naturalWidth) + Math.abs(Math.cos(rotRad) * naturalHeight);
    
    // L'image occupe toujours toute la largeur du conteneur
    const scale = containerWidth / rotatedWidth;
    
    return {
      width: containerWidth,
      height: rotatedHeight * scale,
      scale
    };
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    
    const dimensions = calculateRotatedDimensions(naturalWidth, naturalHeight, rotation);
    
    // Adapter la hauteur du conteneur à l'image
    setContainerHeight(dimensions.height);
    
    // Initialiser avec un recadrage libre couvrant 90% de l'image
    const crop: Crop = {
      unit: '%',
      x: 5,
      y: 5,
      width: 90,
      height: 90,
    };
    
    setCrop(crop);
  };

  const handleGetCroppedImage = async () => {
    if (!imageRef.current || !completedCrop) return;

    setIsLoading(true);

    try {
      const blob = await getCroppedImageBlob(imageRef.current, completedCrop, rotation);
      if (blob) {
        onCropComplete(blob);
      }
    } catch (error) {
      console.error('Error creating cropped image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    handleGetCroppedImage();
    onClose();
  };

  const handleClose = () => {
    resetRotation();
    onClose();
  };

  const handleRotate = (degrees: number) => {
    rotateImage(degrees);
    
    // Recalculer les dimensions du conteneur après rotation
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      const dimensions = calculateRotatedDimensions(naturalWidth, naturalHeight, rotation + degrees);
      setContainerHeight(dimensions.height);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Recadrer l'image</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col">
          <div className="mb-4 flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRotate(-90)}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Pivoter à gauche
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRotate(90)}
              className="flex items-center gap-2"
            >
              <RotateCw className="h-4 w-4" />
              Pivoter à droite
            </Button>
          </div>
          
          <div 
            className="flex justify-center overflow-auto"
            style={{ 
              maxHeight: '70vh',
              width: '100%'
            }}
          >
            <div 
              style={{ 
                width: containerWidth,
                height: containerHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                className="max-w-full max-h-full"
              >
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Image à recadrer"
                  onLoad={onImageLoad}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: 'transform 0.3s ease-in-out',
                    width: containerWidth,
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </ReactCrop>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button onClick={handleComplete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : (
              'Appliquer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
