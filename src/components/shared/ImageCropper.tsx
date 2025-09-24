
import React from 'react';
import { ImageCropperDialog } from './image-cropper/ImageCropperDialog';
import { DocumentDetectionResult } from './image-cropper/hooks/useDocumentDetection';

interface ImageCropperProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number;
  allowHorizontalExpansion?: boolean;
  detectionResult?: DocumentDetectionResult;
}

export function ImageCropper(props: ImageCropperProps) {
  return <ImageCropperDialog {...props} />;
}
