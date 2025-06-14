import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';

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
  const [key, setKey] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour initialiser le recadrage au centre lorsque l'image est chargée
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Initialiser avec un recadrage libre couvrant 80% de l'image, centré
    const crop: Crop = {
      unit: '%',
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    };
    
    setCrop(crop);
  };

  // Fonction pour gérer le zoom
  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev * 1.1 : prev / 1.1;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  // Fonction pour gérer la rotation
  const handleRotation = (direction: 'cw' | 'ccw') => {
    const rotationStep = 90;
    const newRotation = direction === 'cw' 
      ? (rotation + rotationStep) % 360 
      : (rotation - rotationStep + 360) % 360;
    
    setRotation(newRotation);
    
    // Réinitialiser le crop et forcer le remontage du composant ReactCrop
    setCrop(undefined);
    setCompletedCrop(undefined);
    setKey(prev => prev + 1);
  };

  // Fonction pour créer une image recadrée à partir du canvas avec rotation et zoom appliqués
  const getCroppedImage = () => {
    if (!imageRef.current || !completedCrop) return;

    setIsLoading(true);

    const image = imageRef.current;
    const canvas = document.createElement('canvas');
    
    // Calculer les échelles en tenant compte du zoom
    const scaleX = (image.naturalWidth / image.width) / zoom;
    const scaleY = (image.naturalHeight / image.height) / zoom;
    
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsLoading(false);
      return;
    }

    // Calculer les dimensions finales en tenant compte de la rotation
    const rotationInRadians = (rotation * Math.PI) / 180;
    const isRotated90or270 = rotation === 90 || rotation === 270;
    
    // Dimensions du crop dans l'image originale avec zoom
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;
    
    // Définir la taille du canvas en fonction de la rotation
    if (isRotated90or270) {
      canvas.width = cropHeight;
      canvas.height = cropWidth;
    } else {
      canvas.width = cropWidth;
      canvas.height = cropHeight;
    }

    // Sauvegarder l'état du contexte
    ctx.save();

    // Déplacer l'origine au centre du canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Appliquer la rotation
    ctx.rotate(rotationInRadians);

    // Dessiner l'image avec la rotation et le zoom appliqués
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      cropWidth,
      cropHeight,
      -cropWidth / 2,
      -cropHeight / 2,
      cropWidth,
      cropHeight
    );

    // Restaurer l'état du contexte
    ctx.restore();

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Recadrer l'image</DialogTitle>
        </DialogHeader>
        
        {/* Contrôles */}
        <div className="flex justify-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom('out')}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom('in')}
            disabled={zoom >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRotation('ccw')}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRotation('cw')}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="my-4 max-h-[70vh] overflow-auto">
          <div 
            className="flex justify-center items-center"
            style={{ 
              width: '100%', 
              height: '100%'
            }}
          >
            <ReactCrop
              key={key} // Force le remontage du composant lors de la rotation
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              className="max-w-full"
              style={{
                width: '100%',
                height: '100%'
              }}
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Image à recadrer"
                onLoad={onImageLoad}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-in-out',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </ReactCrop>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
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
