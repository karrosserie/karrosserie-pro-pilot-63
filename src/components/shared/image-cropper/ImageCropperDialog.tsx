
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageCropperControls } from './ImageCropperControls';
import { ImageCropperCanvas } from './ImageCropperCanvas';
import { ImageCropperFooter } from './ImageCropperFooter';
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Recadrer l'image</DialogTitle>
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
        
        <ImageCropperFooter
          isLoading={isLoading}
          onCancel={onClose}
          onApply={handleComplete}
        />
      </DialogContent>
    </Dialog>
  );
};
