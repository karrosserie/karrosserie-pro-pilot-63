
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Scan } from 'lucide-react';
import { ImageCropperControls } from './ImageCropperControls';
import { ImageCropperCanvas } from './ImageCropperCanvas';
import { useImageCropper } from './hooks/useImageCropper';
import { useImageTransformations } from './hooks/useImageTransformations';
import { DocumentDetectionResult } from './hooks/useDocumentDetection';

interface ImageCropperDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number;
  allowHorizontalExpansion?: boolean;
  detectionResult?: DocumentDetectionResult;
}

export const ImageCropperDialog: React.FC<ImageCropperDialogProps> = ({
  open,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio,
  allowHorizontalExpansion = false,
  detectionResult
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
  } = useImageCropper(imageUrl, onCropComplete, detectionResult);

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
          <div className="flex items-center gap-2">
            <DialogTitle>Recadrer l'image</DialogTitle>
            {detectionResult && (
              <div className="flex items-center gap-1 text-sm">
                <Scan className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 font-medium">
                  Zone détectée automatiquement ({Math.round(detectionResult.confidence * 100)}% confiance)
                  {detectionResult.rotation !== 0 && (
                    <span className="ml-1 text-blue-600">
                      • Rotation: {Math.round(detectionResult.rotation)}°
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
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

        {detectionResult && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Scan className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-1">
                  Détection automatique appliquée
                </p>
                <p className="text-blue-700">
                  Les contours du document ont été détectés automatiquement.
                  Vous pouvez ajuster la zone de recadrage si nécessaire ou cliquer sur "Appliquer" pour valider.
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
