
import React, { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { ImageCropper } from './ImageCropper';
import { useDocumentUpload } from './document-uploader/hooks/useDocumentUpload';
import { useImageCropping } from './document-uploader/hooks/useImageCropping';
import { DocumentDisplay } from './document-uploader/DocumentDisplay';
import { DocumentUploadLoading } from './document-uploader/DocumentUploadLoading';
import { DocumentAnalysisLoading } from './document-uploader/DocumentAnalysisLoading';
import { DocumentEmptyState } from './document-uploader/DocumentEmptyState';
import { DocumentScanner } from './document-scanner/DocumentScanner';
import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';
import { useMobileDetection } from '@/hooks/use-mobile-detection';

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
  const isMobile = useMobileDetection();
  const [showScanner, setShowScanner] = useState(false);
  const [uploadMode, setUploadMode] = useState<'choice' | 'upload' | 'scan'>('choice');

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

  const handleScanCapture = async (blob: Blob) => {
    const file = new File([blob], `scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
    await handleFileUpload(file);
    setShowScanner(false);
    setUploadMode('choice');
  };

  const handleScanClose = () => {
    setShowScanner(false);
    setUploadMode('choice');
  };

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

  // Show scanner
  if (showScanner) {
    return <DocumentScanner onCapture={handleScanCapture} onClose={handleScanClose} />;
  }

  // Show upload mode choice on mobile
  if (isMobile && uploadMode === 'choice') {
    return (
      <div className="space-y-3">
        <Button
          onClick={() => {
            setShowScanner(true);
            setUploadMode('scan');
          }}
          className="w-full h-20 text-lg"
          size="lg"
        >
          <Camera className="h-6 w-6 mr-3" />
          Scanner le document
        </Button>
        
        <Button
          onClick={() => setUploadMode('upload')}
          variant="outline"
          className="w-full h-20 text-lg"
          size="lg"
        >
          <Upload className="h-6 w-6 mr-3" />
          Choisir un fichier
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <FileUpload
        onUpload={handleFileUpload}
        accept=".pdf,.jpg,.jpeg,.png"
        maxSize={10}
      />
      
      {isMobile && uploadMode === 'upload' && (
        <Button
          onClick={() => setUploadMode('choice')}
          variant="ghost"
          className="w-full mt-2"
          size="sm"
        >
          Retour
        </Button>
      )}
      
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
