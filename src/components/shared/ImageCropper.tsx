
import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, RotateCcw, RotateCw } from 'lucide-react';
import { useImageRotation } from './hooks/useImageRotation';
import { calculateDisplayDimensions, getCroppedImageBlob } from './utils/imageCropperUtils';

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
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const { rotation, rotateImage, resetRotation } = useImageRotation();

  // Fonction pour initialiser le recadrage au centre lorsque l'image est chargée
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    
    // Calculer les dimensions d'affichage pour que l'image reste dans le conteneur
    const containerWidth = 800; // Largeur max du conteneur
    const containerHeight = 600; // Hauteur max du conteneur
    
    const displayDimensions = calculateDisplayDimensions(
      naturalWidth,
      naturalHeight,
      rotation,
      containerWidth,
      containerHeight
    );
    
    setImageDimensions(displayDimensions);
    
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

  // Fonction pour créer une image recadrée à partir du canvas
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
    
    // Recalculer les dimensions d'affichage après rotation
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      const containerWidth = 800;
      const containerHeight = 600;
      
      const newDisplayDimensions = calculateDisplayDimensions(
        naturalWidth,
        naturalHeight,
        rotation + degrees,
        containerWidth,
        containerHeight
      );
      
      setImageDimensions(newDisplayDimensions);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Recadrer l'image</DialogTitle>
        </DialogHeader>
        
        <div className="my-4 max-h-[70vh] overflow-auto">
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
          
          <div className="flex justify-center">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              className="max-w-full"
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Image à recadrer"
                onLoad={onImageLoad}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease-in-out',
                  maxWidth: '100%',
                  maxHeight: '60vh',
                  width: imageDimensions.width || 'auto',
                  height: imageDimensions.height || 'auto',
                  objectFit: 'contain'
                }}
              />
            </ReactCrop>
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
