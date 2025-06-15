
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
  const [maxZoom, setMaxZoom] = useState(3);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculer les dimensions maximales selon la rotation
  const calculateMaxDimensions = (imageWidth: number, imageHeight: number, containerWidth: number, containerHeight: number, currentRotation: number) => {
    const normalizedRotation = Math.abs(currentRotation % 180);
    const isRotated90 = normalizedRotation === 90;
    
    if (isRotated90) {
      // Quand l'image est pivotée de 90°, sa largeur devient sa hauteur et vice versa
      const maxScaleByWidth = containerWidth / imageHeight;
      const maxScaleByHeight = containerHeight / imageWidth;
      return Math.min(maxScaleByWidth, maxScaleByHeight);
    } else {
      // Rotation normale (0°, 180°)
      const maxScaleByWidth = containerWidth / imageWidth;
      const maxScaleByHeight = containerHeight / imageHeight;
      return Math.min(maxScaleByWidth, maxScaleByHeight);
    }
  };

  // Fonction pour initialiser le recadrage au centre lorsque l'image est chargée
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Récupérer les dimensions du conteneur ReactCrop
    const reactCropContainer = e.currentTarget.closest('.ReactCrop') as HTMLElement;
    if (reactCropContainer) {
      const containerRect = reactCropContainer.getBoundingClientRect();
      const maxScale = calculateMaxDimensions(width, height, containerRect.width, containerRect.height, rotation);
      setMaxZoom(maxScale);
      
      // Ajuster le zoom si nécessaire
      if (zoom > maxScale) {
        setZoom(maxScale);
      }
    }
    
    // Initialiser avec un recadrage libre couvrant 80% de l'image, centré
    // Utiliser les dimensions réelles de l'image affichée pour éviter les décalages
    const displayedWidth = width * zoom;
    const displayedHeight = height * zoom;
    
    const crop: Crop = {
      unit: 'px',
      x: displayedWidth * 0.1,
      y: displayedHeight * 0.1,
      width: displayedWidth * 0.8,
      height: displayedHeight * 0.8,
    };
    
    setCrop(crop);
  };

  // Fonction pour gérer le zoom avec vérification des limites
  const handleZoom = (direction: 'in' | 'out') => {
    if (!imageRef.current) return;
    
    const image = imageRef.current;
    const reactCropContainer = image.closest('.ReactCrop') as HTMLElement;
    
    if (reactCropContainer) {
      const containerRect = reactCropContainer.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();
      
      const currentMaxZoom = calculateMaxDimensions(
        imageRect.width / zoom, 
        imageRect.height / zoom, 
        containerRect.width, 
        containerRect.height, 
        rotation
      );
      
      setZoom(prev => {
        const newZoom = direction === 'in' ? prev * 1.1 : prev / 1.1;
        const clampedZoom = Math.max(0.1, Math.min(currentMaxZoom, newZoom));
        
        // Réinitialiser le crop après changement de zoom pour éviter les décalages
        if (imageRef.current) {
          const { width, height } = imageRef.current;
          const displayedWidth = width * clampedZoom;
          const displayedHeight = height * clampedZoom;
          
          setCrop({
            unit: 'px',
            x: displayedWidth * 0.1,
            y: displayedHeight * 0.1,
            width: displayedWidth * 0.8,
            height: displayedHeight * 0.8,
          });
        }
        
        return clampedZoom;
      });
    }
  };

  // Fonction pour gérer la rotation avec recalcul des dimensions
  const handleRotation = (direction: 'cw' | 'ccw') => {
    const rotationStep = 90;
    const newRotation = direction === 'cw' 
      ? (rotation + rotationStep) % 360 
      : (rotation - rotationStep + 360) % 360;
    
    setRotation(newRotation);
    
    // Recalculer le zoom maximum avec la nouvelle rotation
    if (imageRef.current) {
      const image = imageRef.current;
      const reactCropContainer = image.closest('.ReactCrop') as HTMLElement;
      
      if (reactCropContainer) {
        const containerRect = reactCropContainer.getBoundingClientRect();
        const imageRect = image.getBoundingClientRect();
        
        const newMaxZoom = calculateMaxDimensions(
          imageRect.width / zoom, 
          imageRect.height / zoom, 
          containerRect.width, 
          containerRect.height, 
          newRotation
        );
        
        setMaxZoom(newMaxZoom);
        
        // Ajuster le zoom si nécessaire
        if (zoom > newMaxZoom) {
          setZoom(newMaxZoom);
        }
      }
    }
    
    // Réinitialiser le crop et forcer le remontage du composant ReactCrop
    setCrop(undefined);
    setCompletedCrop(undefined);
    setKey(prev => prev + 1);
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

    console.log('=== CROP DEBUG INFO ===');
    console.log('Completed crop:', completedCrop);
    console.log('Image natural size:', image.naturalWidth, 'x', image.naturalHeight);
    console.log('Image displayed size:', image.width, 'x', image.height);
    console.log('Current zoom:', zoom);
    console.log('Current rotation:', rotation);

    // Calculer le ratio entre l'image naturelle et l'image affichée
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    console.log('Scale ratios:', { scaleX, scaleY });

    // Les coordonnées de crop sont dans l'espace de l'image affichée
    // Il faut les convertir vers l'espace de l'image naturelle
    const naturalCropX = completedCrop.x * scaleX;
    const naturalCropY = completedCrop.y * scaleY;
    const naturalCropWidth = completedCrop.width * scaleX;
    const naturalCropHeight = completedCrop.height * scaleY;

    console.log('Natural crop coordinates:', {
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
        
        {/* Contrôles */}
        <div className="flex justify-center gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom('out')}
            disabled={zoom <= 0.1}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom('in')}
            disabled={zoom >= maxZoom}
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
            className="relative w-full h-full flex justify-center items-center overflow-hidden"
            style={{ 
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <ReactCrop
              key={key}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              className="w-full h-full flex justify-center items-center overflow-hidden"
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
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto'
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
