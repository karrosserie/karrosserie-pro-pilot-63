
import React, { useState, useRef } from 'react';
import { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { CropControls } from './CropControls';
import { ImageDisplay } from './ImageDisplay';
import { CropLogic } from './CropLogic';

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
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const hiddenImageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour initialiser le recadrage au centre lorsque l'image est chargée
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Initialiser avec un recadrage libre couvrant 60% de l'image, centré
    const crop: Crop = {
      unit: '%',
      x: 20,
      y: 20,
      width: 60,
      height: 60,
    };
    
    setCrop(crop);
  };

  // Fonction pour gérer le zoom
  const handleZoom = (direction: 'in' | 'out') => {
    const newZoom = direction === 'in' ? zoom * 1.2 : zoom / 1.2;
    const clampedZoom = Math.max(0.5, Math.min(3, newZoom));
    setZoom(clampedZoom);
  };

  // Fonction pour gérer la rotation
  const handleRotation = (direction: 'cw' | 'ccw') => {
    const rotationStep = 90;
    const newRotation = direction === 'cw' 
      ? (rotation + rotationStep) % 360 
      : (rotation - rotationStep + 360) % 360;
    
    setRotation(newRotation);
  };

  const getCroppedImage = () => {
    if (!hiddenImageRef.current || !completedCrop) return;

    setIsLoading(true);

    CropLogic.getCroppedImage(
      hiddenImageRef.current,
      completedCrop,
      rotation,
      zoom,
      (blob) => {
        setIsLoading(false);
        onCropComplete(blob);
      }
    );
  };

  const handleComplete = () => {
    getCroppedImage();
    onClose();
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Recadrer l'image</DialogTitle>
        </DialogHeader>
        
        {/* Image cachée pour les calculs sans transformation */}
        <img
          ref={hiddenImageRef}
          src={imageUrl}
          alt="Image de référence"
          style={{ display: 'none' }}
        />
        
        <CropControls
          zoom={zoom}
          onZoom={handleZoom}
          onRotation={handleRotation}
        />
        
        <ImageDisplay
          imageUrl={imageUrl}
          zoom={zoom}
          rotation={rotation}
          crop={crop}
          onImageLoad={onImageLoad}
          onCropChange={setCrop}
          onCropComplete={setCompletedCrop}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          {zoom !== 1 || rotation !== 0 ? (
            <Button variant="outline" onClick={handleReset}>
              Réinitialiser
            </Button>
          ) : null}
          <Button onClick={handleComplete} disabled={isLoading || !completedCrop}>
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
