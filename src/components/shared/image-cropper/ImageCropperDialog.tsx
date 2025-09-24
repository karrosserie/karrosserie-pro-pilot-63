
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ImageCropperControls } from './ImageCropperControls';
import { ImageCropperCanvas } from './ImageCropperCanvas';
import { useImageCropper } from './hooks/useImageCropper';
import { useImageTransformations } from './hooks/useImageTransformations';

interface ImageCropperDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number;
  allowHorizontalExpansion?: boolean;
}

export const ImageCropperDialog: React.FC<ImageCropperDialogProps> = ({
  open,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio,
  allowHorizontalExpansion = false
}) => {
  const {
    crop,
    setCrop,
    completedCrop,
    setCompletedCrop,
    imageDimensions,
    isLoading,
    imageRef,
    containerRef,
    onImageLoad,
    getCroppedImage
  } = useImageCropper(imageUrl, onCropComplete);

  const {
    zoom,
    rotation,
    maxZoom,
    handleZoom,
    handleRotation
  } = useImageTransformations({
    imageDimensions,
    containerRef
  });

  const handleComplete = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    getCroppedImage(zoom, rotation);
    onClose();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle>Recadrer l'image</DialogTitle>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button 
              type="button"
              onClick={handleApply} 
              disabled={isLoading}
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                'Appliquer'
              )}
            </Button>
          </div>
        </DialogHeader>
        
        <ImageCropperControls
          zoom={zoom}
          maxZoom={maxZoom}
          onZoomIn={() => handleZoom('in')}
          onZoomOut={() => handleZoom('out')}
          onRotateClockwise={() => handleRotation('cw')}
          onRotateCounterClockwise={() => handleRotation('ccw')}
        />
        
        <ImageCropperCanvas
          imageUrl={imageUrl}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          imageRef={imageRef}
          containerRef={containerRef}
          onCropChange={setCrop}
          onCropComplete={setCompletedCrop}
          onImageLoad={onImageLoad}
        />
      </DialogContent>
    </Dialog>
  );
};
