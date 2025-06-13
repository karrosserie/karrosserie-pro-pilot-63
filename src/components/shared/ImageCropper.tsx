
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { ImageCropperControls } from './ImageCropperControls';
import { ImageCropperCanvas } from './ImageCropperCanvas';
import { useImageCropper } from './hooks/useImageCropper';
import { useImageRotation } from './hooks/useImageRotation';

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
  const {
    crop,
    setCrop,
    completedCrop,
    setCompletedCrop,
    isLoading,
    imageRef,
    getCroppedImage
  } = useImageCropper(onCropComplete);

  const { rotation, rotateImage, setRotation } = useImageRotation(setCrop);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Image load handler is now handled in ImageCropperCanvas
  };

  const handleComplete = () => {
    getCroppedImage(rotation);
    onClose();
  };

  const handleClose = () => {
    setRotation(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Recadrer l'image</DialogTitle>
        </DialogHeader>
        
        <div className="my-4 max-h-[70vh] overflow-auto">
          <ImageCropperControls
            onRotateLeft={() => rotateImage(-90)}
            onRotateRight={() => rotateImage(90)}
          />
          
          <ImageCropperCanvas
            imageUrl={imageUrl}
            crop={crop}
            rotation={rotation}
            imageRef={imageRef}
            onCropChange={setCrop}
            onCropComplete={setCompletedCrop}
            onImageLoad={onImageLoad}
          />
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
