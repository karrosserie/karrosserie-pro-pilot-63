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
  const [originalImageDimensions, setOriginalImageDimensions] = useState({ width: 0, height: 0 });
  const [displayImageDimensions, setDisplayImageDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Largeur et hauteur fixes pour la zone ReactCrop
  const cropAreaWidth = 800;
  const cropAreaHeight = 600;

  // Calculer les dimensions d'affichage optimales pour l'image
  const calculateOptimalImageSize = (imageWidth: number, imageHeight: number, rotation: number) => {
    // Calculer les dimensions de l'image après rotation
    const rotRad = Math.abs((rotation * Math.PI) / 180);
    const cos = Math.abs(Math.cos(rotRad));
    const sin = Math.abs(Math.sin(rotRad));
    
    const rotatedWidth = imageWidth * cos + imageHeight * sin;
    const rotatedHeight = imageWidth * sin + imageHeight * cos;

    // Calculer le ratio de redimensionnement pour que l'image occupe le maximum d'espace
    const scaleX = cropAreaWidth / rotatedWidth;
    const scaleY = cropAreaHeight / rotatedHeight;
    const scale = Math.min(scaleX, scaleY) * 0.95; // 0.95 pour laisser un peu de marge

    return {
      width: imageWidth * scale,
      height: imageHeight * scale
    };
  };

  // Fonction pour initialiser le recadrage au centre lorsque l'image est chargée
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setOriginalImageDimensions({ width, height });
    
    // Calculer les dimensions d'affichage optimales
    const displayDimensions = calculateOptimalImageSize(width, height, rotation);
    setDisplayImageDimensions(displayDimensions);
    
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
    const newRotation = (rotation + degrees) % 360;
    setRotation(newRotation);
    
    // Recalculer les dimensions d'affichage après rotation
    if (imageLoaded) {
      const displayDimensions = calculateOptimalImageSize(
        originalImageDimensions.width, 
        originalImageDimensions.height, 
        newRotation
      );
      setDisplayImageDimensions(displayDimensions);
    }
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
      originalImageDimensions.width,
      originalImageDimensions.height,
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
    tempCtx.translate(-originalImageDimensions.width / 2, -originalImageDimensions.height / 2);
    tempCtx.drawImage(image, 0, 0);

    // Calculer les coordonnées de recadrage avec la rotation
    const scaleX = originalImageDimensions.width / bBoxWidth;
    const scaleY = originalImageDimensions.height / bBoxHeight;

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
    setOriginalImageDimensions({ width: 0, height: 0 });
    setDisplayImageDimensions({ width: 0, height: 0 });
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Recadrer l'image</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0">
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
          
          <div className="flex-1 flex justify-center items-center min-h-0">
            <div 
              style={{
                width: `${cropAreaWidth}px`,
                height: `${cropAreaHeight}px`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                style={{
                  width: `${cropAreaWidth}px`,
                  height: `${cropAreaHeight}px`,
                  overflow: 'hidden'
                }}
              >
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Image à recadrer"
                  onLoad={onImageLoad}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.3s ease-in-out',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    marginLeft: imageLoaded ? `-${displayImageDimensions.width / 2}px` : '0',
                    marginTop: imageLoaded ? `-${displayImageDimensions.height / 2}px` : '0',
                    width: imageLoaded ? `${displayImageDimensions.width}px` : 'auto',
                    height: imageLoaded ? `${displayImageDimensions.height}px` : 'auto',
                    maxWidth: 'none'
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
