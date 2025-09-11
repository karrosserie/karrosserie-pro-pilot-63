
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
  onAnalysisComplete?: (data: any) => void;
  onDelete?: () => void;
  isViewMode?: boolean;
  customContent?: React.ReactNode;
  allowDeleteInViewMode?: boolean;
}

export function DocumentUploader({
  documentType,
  documentId,
  currentDocumentUrl,
  onUploadComplete,
  onAnalysisComplete,
  onDelete: customOnDelete,
  isViewMode = false,
  customContent,
  allowDeleteInViewMode = false
}: DocumentUploaderProps) {
  const { isUploading, isDeleting, isAnalyzing, uploadFile, handleDelete } = useDocumentUpload({
    documentType,
    documentId,
    onUploadComplete,
    onAnalysisComplete
  });

  console.log('DocumentUploader states:', { isUploading, isDeleting, isAnalyzing, documentType });

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

  // Ne pas afficher le spinner pendant le crop, laisser l'ImageCropper s'afficher

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
        onDelete={customOnDelete || (() => handleDelete(currentDocumentUrl))}
        customContent={customContent}
        allowDeleteInViewMode={allowDeleteInViewMode}
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
