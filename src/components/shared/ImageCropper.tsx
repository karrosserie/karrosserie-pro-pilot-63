
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
    
    console.log('Crop coordinates:', completedCrop);
    console.log('Image natural size:', image.naturalWidth, 'x', image.naturalHeight);
    console.log('Current zoom:', zoom);
    
    // Récupérer les dimensions réelles de l'image affichée dans le DOM
    const imageRect = image.getBoundingClientRect();
    const displayedImageWidth = imageRect.width;
    const displayedImageHeight = imageRect.height;
    
    console.log('Real displayed image dimensions:', displayedImageWidth, 'x', displayedImageHeight);
    
    // Calculer les dimensions de l'image avec le zoom appliqué
    const zoomedImageWidth = displayedImageWidth * zoom;
    const zoomedImageHeight = displayedImageHeight * zoom;
    
    console.log('Zoomed image dimensions:', zoomedImageWidth, 'x', zoomedImageHeight);
    
    // Récupérer le conteneur ReactCrop
    const reactCropContainer = image.closest('.ReactCrop') as HTMLElement;
    if (!reactCropContainer) {
      console.error('ReactCrop container not found');
      setIsLoading(false);
      return;
    }
    
    const containerRect = reactCropContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    console.log('ReactCrop container dimensions:', containerWidth, 'x', containerHeight);
    
    // Calculer l'offset de l'image zoomée dans le conteneur (image centrée)
    const imageOffsetX = (containerWidth - zoomedImageWidth) / 2;
    const imageOffsetY = (containerHeight - zoomedImageHeight) / 2;
    
    console.log('Image offset in container:', imageOffsetX, imageOffsetY);
    
    // Convertir les coordonnées du crop (relatives au conteneur) vers l'image zoomée
    const cropXInZoomedImage = completedCrop.x - imageOffsetX;
    const cropYInZoomedImage = completedCrop.y - imageOffsetY;
    
    console.log('Crop position in zoomed image:', cropXInZoomedImage, cropYInZoomedImage);
    
    // Calculer le ratio pour convertir vers l'image naturelle
    const scaleToNaturalX = image.naturalWidth / zoomedImageWidth;
    const scaleToNaturalY = image.naturalHeight / zoomedImageHeight;
    
    console.log('Scale to natural:', scaleToNaturalX, scaleToNaturalY);
    
    // Calculer les coordonnées finales dans l'image naturelle
    const finalCropX = cropXInZoomedImage * scaleToNaturalX;
    const finalCropY = cropYInZoomedImage * scaleToNaturalY;
    const finalCropWidth = completedCrop.width * scaleToNaturalX;
    const finalCropHeight = completedCrop.height * scaleToNaturalY;
    
    console.log('Final crop in natural image:', {
      x: finalCropX,
      y: finalCropY,
      width: finalCropWidth,
      height: finalCropHeight
    });
    
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsLoading(false);
      return;
    }

    // Calculer les dimensions finales en tenant compte de la rotation
    const rotationInRadians = (rotation * Math.PI) / 180;
    const isRotated90or270 = rotation === 90 || rotation === 270;
    
    // Définir la taille du canvas en fonction de la rotation
    if (isRotated90or270) {
      canvas.width = finalCropHeight;
      canvas.height = finalCropWidth;
    } else {
      canvas.width = finalCropWidth;
      canvas.height = finalCropHeight;
    }

    // Sauvegarder l'état du contexte
    ctx.save();

    // Déplacer l'origine au centre du canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Appliquer la rotation
    ctx.rotate(rotationInRadians);

    // Dessiner l'image avec la rotation appliquée
    ctx.drawImage(
      image,
      finalCropX,
      finalCropY,
      finalCropWidth,
      finalCropHeight,
      -finalCropWidth / 2,
      -finalCropHeight / 2,
      finalCropWidth,
      finalCropHeight
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
              className="w-full h-full flex justify-center items-center"
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
