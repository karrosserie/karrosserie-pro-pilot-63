
import React from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { ImageCropper } from './ImageCropper';
import { useDocumentUpload } from './document-uploader/hooks/useDocumentUpload';
import { useImageCropping } from './document-uploader/hooks/useImageCropping';
import { DocumentDisplay } from './document-uploader/DocumentDisplay';
import { DocumentUploadLoading } from './document-uploader/DocumentUploadLoading';
import { DocumentUploadProcessing } from './document-uploader/DocumentUploadProcessing';
import { DocumentEmptyState } from './document-uploader/DocumentEmptyState';

interface DocumentUploaderProps {
  documentType: string;
  documentId: string;
  currentDocumentUrl?: string | null;
  onUploadComplete: (url: string) => void;
  isViewMode?: boolean;
  requiresAIProcessing?: boolean;
}

export function DocumentUploader({
  documentType,
  documentId,
  currentDocumentUrl,
  onUploadComplete,
  isViewMode = false,
  requiresAIProcessing = false
}: DocumentUploaderProps) {
  const { 
    isUploading, 
    isDeleting, 
    isProcessing, 
    progress, 
    currentMessage, 
    uploadFile, 
    handleDelete 
  } = useDocumentUpload({
    documentType,
    documentId,
    onUploadComplete,
    requiresAIProcessing
  });

  const {
    imageToProcess,
    cropDialogOpen,
    isDriverLicense,
    handleFileUpload,
    handleCropComplete,
    handleCropCancel
  } = useImageCropping({
    documentType,
    onFileUpload: uploadFile
  });

  if (isProcessing) {
    return (
      <DocumentUploadProcessing 
        progress={progress} 
        message={currentMessage}
      />
    );
  }

  if (isUploading && !isProcessing) {
    return <DocumentUploadLoading />;
  }
  
  if (currentDocumentUrl) {
    return (
      <DocumentDisplay
        documentUrl={currentDocumentUrl}
        isViewMode={isViewMode}
        isDeleting={isDeleting}
        onDelete={() => handleDelete(currentDocumentUrl)}
      />
    );
  }
  
  if (isViewMode) {
    return <DocumentEmptyState />;
  }
  
  return (
    <>
      <FileUpload
        onUpload={handleFileUpload}
        accept=".pdf,.jpg,.jpeg,.png"
        maxSize={10}
      />
      
      {imageToProcess && (
        <ImageCropper
          open={cropDialogOpen}
          onClose={handleCropCancel}
          imageUrl={imageToProcess.tempUrl}
          onCropComplete={handleCropComplete}
          aspectRatio={4 / 3}
          allowHorizontalExpansion={isDriverLicense}
        />
      )}
    </>
  );
}
