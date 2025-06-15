
import React from 'react';
import { ImageCropperDialog } from './image-cropper/ImageCropperDialog';

interface ImageCropperProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number;
  allowHorizontalExpansion?: boolean;
}

export function ImageCropper(props: ImageCropperProps) {
  return <ImageCropperDialog {...props} />;
}
