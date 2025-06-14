
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
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculer les dimensions après rotation
  const getRotatedDimensions = (width: number, height: number, rotation: number) => {
    const rotRad = Math.abs((rotation * Math.PI) / 180);
    const cos = Math.abs(Math.cos(rotRad));
    const sin = Math.abs(Math.sin(rotRad));
    
    return {
      width: width * cos + height * sin,
      height: width * sin + height * cos,
    };
  };

  // Fonction pour initialiser le recadrage au centre lorsque l'image est chargée
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setImageDimensions({ width, height });
    setImageLoaded(true);
    
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

  // Fonction pour faire pivoter l'image
  const rotateImage = (degrees: number) => {
    setRotation(prev => (prev + degrees) % 360);
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
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
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

  // Fonction utilitaire pour calculer les dimensions après rotation
  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = Math.abs((rotation * Math.PI) / 180);
    
    return {
      width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  };

  const handleComplete = () => {
    getCroppedImage();
    onClose();
  };

  const handleClose = () => {
    setRotation(0);
    setImageLoaded(false);
    setImageDimensions({ width: 0, height: 0 });
    onClose();
  };

  // Largeur fixe pour la zone ReactCrop
  const cropAreaWidth = 800; // Largeur fixe
  const cropAreaHeight = 600; // Hauteur fixe
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl">
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
              disabled={!imageLoaded}
            >
              <RotateCcw className="h-4 w-4" />
              Pivoter à gauche
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => rotateImage(90)}
              className="flex items-center gap-2"
              disabled={!imageLoaded}
            >
              <RotateCw className="h-4 w-4" />
              Pivoter à droite
            </Button>
          </div>
          
          <div className="flex justify-center">
            <div 
              style={{
                width: `${cropAreaWidth}px`,
                height: `${cropAreaHeight}px`,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                className="w-full h-full"
                style={{
                  width: `${cropAreaWidth}px`,
                  height: `${cropAreaHeight}px`
                }}
              >
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Image à recadrer"
                  onLoad={onImageLoad}
                  className="max-w-none"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.3s ease-in-out',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    marginLeft: imageLoaded ? `-${imageDimensions.width / 2}px` : '0',
                    marginTop: imageLoaded ? `-${imageDimensions.height / 2}px` : '0',
                    width: imageLoaded ? `${imageDimensions.width}px` : 'auto',
                    height: imageLoaded ? `${imageDimensions.height}px` : 'auto'
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
          <Button onClick={handleComplete} disabled={isLoading || !imageLoaded}>
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
