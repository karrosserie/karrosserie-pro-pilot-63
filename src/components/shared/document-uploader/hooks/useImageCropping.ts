
import { useState } from 'react';
import { useDocumentDetection, DocumentDetectionResult } from '../../image-cropper/hooks/useDocumentDetection';

interface UseImageCroppingProps {
  documentType: string;
  onFileUpload: (file: File) => Promise<void>;
}

export function useImageCropping({ documentType, onFileUpload }: UseImageCroppingProps) {
  const [imageToProcess, setImageToProcess] = useState<{ file: File, tempUrl: string, detectionResult?: DocumentDetectionResult } | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [isProcessingDocument, setIsProcessingDocument] = useState(false);

  const { isDetecting, detectDocument, applyPerspectiveCorrection } = useDocumentDetection();

  // Types de documents qui bénéficient de la détection automatique
  const isAutoDetectionEnabled = [
    'driver-license',
    'vehicle-registration',
    'receipt'
  ].includes(documentType);

  const handleFileUpload = async (file: File) => {
    console.log('Starting file upload:', { fileName: file.name, fileSize: file.size, documentType });

    if (file.type.startsWith('image/')) {
      console.log('Image file detected, starting crop process');
      const tempUrl = URL.createObjectURL(file);

      // Si la détection automatique est activée pour ce type de document
      if (isAutoDetectionEnabled) {
        console.log('Auto-detection enabled for document type:', documentType);
        setIsProcessingDocument(true);

        try {
          // Créer un élément image pour la détection
          const img = new Image();
          img.onload = async () => {
            try {
              const detectionResult = await detectDocument(img, documentType);
              console.log('Document detection result:', detectionResult);

              // Si la détection a une bonne confiance, appliquer directement la correction
              if (detectionResult.success && detectionResult.confidence > 0.7) {
                console.log('High confidence detection, applying automatic correction');
                const correctedBlob = await applyPerspectiveCorrection(img, detectionResult.corners);

                // Créer un nouveau fichier avec l'image corrigée
                const correctedFile = new File([correctedBlob], file.name, { type: file.type });

                // Upload direct du fichier corrigé
                setIsProcessingDocument(false);
                URL.revokeObjectURL(tempUrl);
                await onFileUpload(correctedFile);
                return;
              } else {
                // Confiance faible, passer au crop manuel avec les coins détectés
                console.log('Low confidence detection, opening manual crop with detected corners');
                setImageToProcess({ file, tempUrl, detectionResult });
                setCropDialogOpen(true);
              }
            } catch (error) {
              console.error('Error during document detection:', error);
              // En cas d'erreur, passer au crop manuel normal
              setImageToProcess({ file, tempUrl });
              setCropDialogOpen(true);
            } finally {
              setIsProcessingDocument(false);
            }
          };

          img.onerror = () => {
            console.error('Failed to load image for detection');
            setIsProcessingDocument(false);
            setImageToProcess({ file, tempUrl });
            setCropDialogOpen(true);
          };

          img.src = tempUrl;
        } catch (error) {
          console.error('Error initializing document detection:', error);
          setIsProcessingDocument(false);
          setImageToProcess({ file, tempUrl });
          setCropDialogOpen(true);
        }
      } else {
        // Pas de détection automatique, crop manuel normal
        setImageToProcess({ file, tempUrl });
        setCropDialogOpen(true);
      }
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
    isAutoDetectionEnabled,
    isProcessingDocument,
    isDetecting,
    handleFileUpload,
    handleCropComplete,
    handleCropCancel
  };
}
