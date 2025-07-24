
import { useState } from 'react';

interface UseImageCroppingProps {
  documentType: string;
  onFileUpload: (file: File) => Promise<void>;
}

export function useImageCropping({ documentType, onFileUpload }: UseImageCroppingProps) {
  const [imageToProcess, setImageToProcess] = useState<{ file: File, tempUrl: string } | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);

  const handleFileUpload = async (file: File) => {
    console.log('Starting file upload:', { fileName: file.name, fileSize: file.size, documentType });
    
    if (file.type.startsWith('image/')) {
      console.log('Image file detected, starting crop process');
      const tempUrl = URL.createObjectURL(file);
      setImageToProcess({ file, tempUrl });
      setCropDialogOpen(true);
      return;
    }
    
    console.log('Non-image file, uploading directly');
    await onFileUpload(file);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!imageToProcess) return;
    
    console.log('Crop completed, starting upload process');
    setCropDialogOpen(false);
    
    const filename = imageToProcess.file.name;
    const fileType = imageToProcess.file.type;
    const croppedFile = new File([croppedImageBlob], filename, { type: fileType });
    
    URL.revokeObjectURL(imageToProcess.tempUrl);
    setImageToProcess(null);
    
    console.log('Uploading cropped file');
    await onFileUpload(croppedFile);
  };
  
  const handleCropCancel = () => {
    if (imageToProcess) {
      URL.revokeObjectURL(imageToProcess.tempUrl);
      setImageToProcess(null);
    }
    setCropDialogOpen(false);
  };

  const isDriverLicense = documentType === 'driver-license';

  return {
    imageToProcess,
    cropDialogOpen,
    isDriverLicense,
    handleFileUpload,
    handleCropComplete,
    handleCropCancel
  };
}
