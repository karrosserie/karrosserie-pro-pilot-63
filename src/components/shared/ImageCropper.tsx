
import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculer les dimensions effectives de l'image après rotation
  const getEffectiveDimensions = useCallback((width: number, height: number, rotation: number) => {
    const normalizedRotation = Math.abs(rotation) % 360;
    const isRotated90or270 = normalizedRotation === 90 || normalizedRotation === 270;
    
    return {
      width: isRotated90or270 ? height : width,
      height: isRotated90or270 ? width : height
    };
  }, []);

  // Calculer le zoom maximum pour que l'image reste dans le conteneur
  const getMaxZoom = useCallback((imageWidth: number, imageHeight: number, rotation: number) => {
    if (!containerRef.current) return 3;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    const effectiveDims = getEffectiveDimensions(imageWidth, imageHeight, rotation);
    
    const maxZoomX = containerWidth / effectiveDims.width;
    const maxZoomY = containerHeight / effectiveDims.height;
    
    return Math.min(maxZoomX, maxZoomY, 3); // Limiter à 3x maximum
  }, [getEffectiveDimensions]);

  // Fonction pour initialiser le recadrage au centre lorsque l'image est chargée
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setImageDimensions({ width, height });
    
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

  // Reset crop when zoom or rotation changes to avoid offset issues
  useEffect(() => {
    if (imageDimensions.width > 0) {
      // Réinitialiser le crop avec des valeurs par défaut
      const defaultCrop: Crop = {
        unit: '%',
        x: 10,
        y: 10,
        width: 80,
        height: 80,
      };
      setCrop(defaultCrop);
      setCompletedCrop(undefined);
      setKey(prev => prev + 1);
    }
  }, [zoom, rotation, imageDimensions]);

  // Fonction pour gérer le zoom avec contraintes
  const handleZoom = (direction: 'in' | 'out') => {
    const newZoom = direction === 'in' ? zoom * 1.1 : zoom / 1.1;
    const maxZoom = getMaxZoom(imageDimensions.width, imageDimensions.height, rotation);
    const clampedZoom = Math.max(0.5, Math.min(maxZoom, newZoom));
    setZoom(clampedZoom);
  };

  // Fonction pour gérer la rotation avec ajustement du zoom
  const handleRotation = (direction: 'cw' | 'ccw') => {
    const rotationStep = 90;
    const newRotation = direction === 'cw' 
      ? (rotation + rotationStep) % 360 
      : (rotation - rotationStep + 360) % 360;
    
    setRotation(newRotation);
    
    // Ajuster le zoom pour que l'image reste dans le conteneur après rotation
    const maxZoom = getMaxZoom(imageDimensions.width, imageDimensions.height, newRotation);
    if (zoom > maxZoom) {
      setZoom(maxZoom);
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

  // Calculer le zoom maximum actuel
  const maxZoom = getMaxZoom(imageDimensions.width, imageDimensions.height, rotation);

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
            disabled={zoom <= 0.5}
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
            ref={containerRef}
            className="relative overflow-hidden border border-gray-200 rounded-lg bg-gray-50"
            style={{ 
              width: '100%',
              height: '100%',
              maxWidth: '800px',
              maxHeight: '600px'
            }}
          >
            {/* Conteneur sans transformation pour ReactCrop */}
            <div
              ref={cropContainerRef}
              className="w-full h-full flex justify-center items-center"
            >
              <ReactCrop
                key={key}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                className="flex justify-center items-center"
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
