
import React from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { ImageCropper } from './ImageCropper';
import { useDocumentUpload } from './document-uploader/hooks/useDocumentUpload';
import { useImageCropping } from './document-uploader/hooks/useImageCropping';
import { DocumentDisplay } from './document-uploader/DocumentDisplay';
import { DocumentUploadLoading } from './document-uploader/DocumentUploadLoading';
import { DocumentAnalysisLoading } from './document-uploader/DocumentAnalysisLoading';
import { DocumentEmptyState } from './document-uploader/DocumentEmptyState';

interface DocumentUploaderProps {
  documentType: string;
  documentId: string;
  currentDocumentUrl?: string | null;
  onUploadComplete: (url: string) => void;
  isViewMode?: boolean;
  customContent?: React.ReactNode;
}

export function DocumentUploader({
  documentType,
  documentId,
  currentDocumentUrl,
  onUploadComplete,
  isViewMode = false,
  customContent
}: DocumentUploaderProps) {
  const { isUploading, isDeleting, isAnalyzing, uploadFile, handleDelete } = useDocumentUpload({
    documentType,
    documentId,
    onUploadComplete
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

  if (isUploading) {
    return <DocumentUploadLoading />;
  }

  if (isAnalyzing) {
    return <DocumentAnalysisLoading />;
  }
  
  if (currentDocumentUrl) {
    return (
      <DocumentDisplay
        documentUrl={currentDocumentUrl}
        isViewMode={isViewMode}
        isDeleting={isDeleting}
        isAnalyzing={isAnalyzing}
        onDelete={() => handleDelete(currentDocumentUrl)}
        customContent={customContent}
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
