
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
  const imageRef = useRef<HTMLImageElement>(null);
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
    
    // Réinitialiser le crop lors du zoom pour éviter les décalages
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  // Fonction pour gérer la rotation
  const handleRotation = (direction: 'cw' | 'ccw') => {
    const rotationStep = 90;
    const newRotation = direction === 'cw' 
      ? (rotation + rotationStep) % 360 
      : (rotation - rotationStep + 360) % 360;
    
    setRotation(newRotation);
    
    // Réinitialiser le crop lors de la rotation pour éviter les décalages
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  // Fonction pour créer une image recadrée à partir du canvas
  const getCroppedImage = () => {
    if (!hiddenImageRef.current || !completedCrop) return;

    setIsLoading(true);

    const image = hiddenImageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsLoading(false);
      return;
    }

    console.log('=== CROP DEBUG INFO ===');
    console.log('Completed crop:', completedCrop);
    console.log('Image natural size:', image.naturalWidth, 'x', image.naturalHeight);
    console.log('Current zoom:', zoom);
    console.log('Current rotation:', rotation);

    // Utiliser directement les coordonnées du crop sur l'image non transformée
    const naturalCropX = completedCrop.x;
    const naturalCropY = completedCrop.y;
    const naturalCropWidth = completedCrop.width;
    const naturalCropHeight = completedCrop.height;

    console.log('Crop coordinates:', {
      x: naturalCropX,
      y: naturalCropY,
      width: naturalCropWidth,
      height: naturalCropHeight
    });

    // Calculer les dimensions finales en tenant compte de la rotation
    const rotationInRadians = (rotation * Math.PI) / 180;
    const isRotated90or270 = rotation === 90 || rotation === 270;
    
    // Définir la taille du canvas en fonction de la rotation
    if (isRotated90or270) {
      canvas.width = naturalCropHeight;
      canvas.height = naturalCropWidth;
    } else {
      canvas.width = naturalCropWidth;
      canvas.height = naturalCropHeight;
    }

    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

    // Sauvegarder l'état du contexte
    ctx.save();

    // Déplacer l'origine au centre du canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Appliquer la rotation
    ctx.rotate(rotationInRadians);

    // Dessiner l'image avec la rotation appliquée
    ctx.drawImage(
      image,
      naturalCropX,
      naturalCropY,
      naturalCropWidth,
      naturalCropHeight,
      -naturalCropWidth / 2,
      -naturalCropHeight / 2,
      naturalCropWidth,
      naturalCropHeight
    );

    // Restaurer l'état du contexte
    ctx.restore();

    console.log('=== END CROP DEBUG ===');

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
        
        {/* Image cachée pour les calculs sans transformation */}
        <img
          ref={hiddenImageRef}
          src={imageUrl}
          alt="Image de référence"
          style={{ display: 'none' }}
        />
        
        {/* Contrôles */}
        <div className="flex justify-center gap-2 mb-2">
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
            {/* Image avec transformations visuelles mais sans crop si zoom ou rotation */}
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
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
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
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          {zoom !== 1 || rotation !== 0 ? (
            <Button 
              variant="outline" 
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setCrop(undefined);
                setCompletedCrop(undefined);
              }}
            >
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
