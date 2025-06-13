
import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, RotateCcw, RotateCw } from 'lucide-react';

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
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour initialiser le recadrage au centre lorsque l'image est chargée
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
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

  // Fonction pour calculer les nouvelles dimensions après rotation
  const getRotatedDimensions = (width: number, height: number, rotation: number) => {
    const rotRad = Math.abs((rotation * Math.PI) / 180);
    
    return {
      width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  };

  // Fonction pour ajuster la zone de recadrage après rotation
  const adjustCropAfterRotation = () => {
    if (!imageRef.current) return;

    const image = imageRef.current;
    const { width: originalWidth, height: originalHeight } = image;
    const { width: rotatedWidth, height: rotatedHeight } = getRotatedDimensions(originalWidth, originalHeight, rotation);

    // Calculer le ratio de redimensionnement
    const scaleX = rotatedWidth / originalWidth;
    const scaleY = rotatedHeight / originalHeight;

    // Ajuster la zone de recadrage pour qu'elle reste proportionnelle
    const newCrop: Crop = {
      unit: '%',
      x: 5,
      y: 5,
      width: 90,
      height: 90,
    };

    setCrop(newCrop);
  };

  // Fonction pour faire pivoter l'image
  const rotateImage = (degrees: number) => {
    setRotation(prev => (prev + degrees) % 360);
    // Ajuster la zone de recadrage après la rotation
    setTimeout(() => {
      adjustCropAfterRotation();
    }, 100); // Petit délai pour laisser le temps à la rotation de s'appliquer
  };

  // Fonction pour créer une image recadrée à partir du canvas
  const getCroppedImage = () => {
    if (!imageRef.current || !completedCrop) return;

    setIsLoading(true);

    const image = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsLoading(false);
      return;
    }

    // Calculer les dimensions en tenant compte de la rotation
    const rotRad = (rotation * Math.PI) / 180;
    const { width: bBoxWidth, height: bBoxHeight } = getRotatedDimensions(
      image.width,
      image.height,
      rotation
    );

    // Configurer le canvas
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    // Créer un canvas temporaire pour l'image pivotée
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) {
      setIsLoading(false);
      return;
    }

    tempCanvas.width = bBoxWidth;
    tempCanvas.height = bBoxHeight;

    // Appliquer la rotation sur le canvas temporaire
    tempCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
    tempCtx.rotate(rotRad);
    tempCtx.scale(1, 1);
    tempCtx.translate(-image.width / 2, -image.height / 2);
    tempCtx.drawImage(image, 0, 0);

    // Calculer les coordonnées de recadrage avec la rotation
    const scaleX = image.naturalWidth / bBoxWidth;
    const scaleY = image.naturalHeight / bBoxHeight;

    // Dessiner la portion recadrée
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

    // Convertir le canvas en Blob
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

  const handleComplete = () => {
    getCroppedImage();
    onClose();
  };

  const handleClose = () => {
    setRotation(0);
    onClose();
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
              onClick={() => rotateImage(-90)}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Pivoter à gauche
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => rotateImage(90)}
              className="flex items-center gap-2"
            >
              <RotateCw className="h-4 w-4" />
              Pivoter à droite
            </Button>
          </div>
          
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
              className="max-w-full"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease-in-out'
              }}
            />
          </ReactCrop>
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
