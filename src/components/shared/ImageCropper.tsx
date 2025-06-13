
import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, RotateCcw, RotateCw } from 'lucide-react';
import { useImageRotation } from './hooks/useImageRotation';
import { getCroppedImageBlob } from './utils/imageCropperUtils';

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
  const [reactCropDimensions, setReactCropDimensions] = useState({ width: 800, height: 600 });
  const imageRef = useRef<HTMLImageElement>(null);
  const { rotation, rotateImage, resetRotation } = useImageRotation();

  // Largeur fixe maximale pour le conteneur ReactCrop
  const maxContainerWidth = 800;

  // Calculer les dimensions du conteneur ReactCrop après rotation
  const calculateReactCropDimensions = (naturalWidth: number, naturalHeight: number, rotation: number) => {
    const rotRad = Math.abs((rotation * Math.PI) / 180);
    
    // Dimensions de l'image après rotation
    const rotatedWidth = Math.abs(Math.cos(rotRad) * naturalWidth) + Math.abs(Math.sin(rotRad) * naturalHeight);
    const rotatedHeight = Math.abs(Math.sin(rotRad) * naturalWidth) + Math.abs(Math.cos(rotRad) * naturalHeight);
    
    // Le conteneur ReactCrop occupe toujours la largeur maximale
    const containerWidth = maxContainerWidth;
    
    // Calculer l'échelle pour que l'image remplisse la largeur du conteneur
    const scale = containerWidth / rotatedWidth;
    
    // La hauteur du conteneur s'adapte à la hauteur de l'image redimensionnée
    const containerHeight = rotatedHeight * scale;
    
    return {
      width: containerWidth,
      height: containerHeight,
      scale
    };
  };

  // Calculer la position pour aligner le coin supérieur gauche de l'image pivotée
  const calculateImagePosition = (naturalWidth: number, naturalHeight: number, rotation: number, scale: number) => {
    if (rotation === 0) {
      return { left: 0, top: 0 };
    }

    const rotRad = (rotation * Math.PI) / 180;
    
    // Dimensions de l'image mise à l'échelle
    const scaledWidth = naturalWidth * scale;
    const scaledHeight = naturalHeight * scale;
    
    // Les 4 coins de l'image avant rotation (par rapport au centre de l'image)
    const corners = [
      { x: -scaledWidth / 2, y: -scaledHeight / 2 }, // coin supérieur gauche
      { x: scaledWidth / 2, y: -scaledHeight / 2 },  // coin supérieur droit
      { x: scaledWidth / 2, y: scaledHeight / 2 },   // coin inférieur droit
      { x: -scaledWidth / 2, y: scaledHeight / 2 }   // coin inférieur gauche
    ];
    
    // Appliquer la rotation aux coins
    const rotatedCorners = corners.map(corner => ({
      x: corner.x * Math.cos(rotRad) - corner.y * Math.sin(rotRad),
      y: corner.x * Math.sin(rotRad) + corner.y * Math.cos(rotRad)
    }));
    
    // Trouver les limites de la bounding box après rotation
    const minX = Math.min(...rotatedCorners.map(c => c.x));
    const minY = Math.min(...rotatedCorners.map(c => c.y));
    
    // Position de l'image pour que son coin supérieur gauche après rotation soit à (0,0)
    const left = -minX;
    const top = -minY;
    
    return { left, top };
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    
    const dimensions = calculateReactCropDimensions(naturalWidth, naturalHeight, rotation);
    setReactCropDimensions({ width: dimensions.width, height: dimensions.height });
    
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
    
    // Recalculer les dimensions du conteneur ReactCrop après rotation
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      const dimensions = calculateReactCropDimensions(naturalWidth, naturalHeight, rotation + degrees);
      setReactCropDimensions({ width: dimensions.width, height: dimensions.height });
    }
  };

  // Calculer le style de l'image avec rotation et position
  const getImageStyle = () => {
    if (!imageRef.current) {
      return {
        transformOrigin: 'center center',
        transition: 'transform 0.3s ease-in-out',
        width: reactCropDimensions.width,
        height: 'auto',
        display: 'block' as const,
        position: 'absolute' as const,
        top: 0,
        left: 0,
        transform: `rotate(${rotation}deg)`
      };
    }

    const { naturalWidth, naturalHeight } = imageRef.current;
    const dimensions = calculateReactCropDimensions(naturalWidth, naturalHeight, rotation);
    const { left, top } = calculateImagePosition(naturalWidth, naturalHeight, rotation, dimensions.scale);

    return {
      transformOrigin: 'center center',
      transition: 'transform 0.3s ease-in-out',
      width: naturalWidth * dimensions.scale,
      height: naturalHeight * dimensions.scale,
      display: 'block' as const,
      position: 'absolute' as const,
      top: top,
      left: left,
      transform: `rotate(${rotation}deg)`
    };
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Recadrer l'image</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col">
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
          
          <div 
            className="flex justify-center overflow-auto"
            style={{ 
              maxHeight: '70vh',
              width: '100%'
            }}
          >
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              style={{ 
                width: reactCropDimensions.width,
                height: reactCropDimensions.height 
              }}
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Image à recadrer"
                onLoad={onImageLoad}
                style={getImageStyle()}
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
