import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Loader2, FileIcon, DownloadIcon, Trash, CropIcon } from 'lucide-react';
import { useStorage } from '@/hooks/use-storage';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ImageCropper } from './ImageCropper';

interface DocumentUploaderProps {
  documentType: string;
  documentId: string;
  currentDocumentUrl?: string | null;
  onUploadComplete: (url: string) => void;
  isViewMode?: boolean;
}

export function DocumentUploader({
  documentType,
  documentId,
  currentDocumentUrl,
  onUploadComplete,
  isViewMode = false
}: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageToProcess, setImageToProcess] = useState<{ file: File, tempUrl: string } | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const { uploadDocument, deleteDocument } = useStorage();
  const { toast } = useToast();
  const { user } = useAuth();

  // Extract filename from URL
  const getFilename = (url: string) => {
    try {
      const pathname = new URL(url).pathname;
      const segments = pathname.split('/');
      return segments[segments.length - 1];
    } catch (e) {
      return 'document';
    }
  };
  
  const handleUpload = async (file: File) => {
    console.log('Starting file upload:', { fileName: file.name, fileSize: file.size, documentType, documentId });
    
    // Vérifier si le fichier est une image pour proposer le recadrage
    if (file.type.startsWith('image/')) {
      const tempUrl = URL.createObjectURL(file);
      setImageToProcess({ file, tempUrl });
      setCropDialogOpen(true);
      return;
    }
    
    // Si ce n'est pas une image, procéder à l'upload direct
    await uploadFile(file);
  };
  
  const uploadFile = async (file: File) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour télécharger un document.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      console.log('Uploading file to storage...', { userId: user.id, documentType, documentId });
      const url = await uploadDocument(file, documentType, documentId);
      console.log('Upload successful, URL:', url);
      
      if (url) {
        onUploadComplete(url);
        toast({
          title: "Document téléchargé",
          description: "Le document a été téléchargé avec succès."
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur de téléchargement",
        description: `Impossible de télécharger le document: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!currentDocumentUrl || !user) return;
    
    setIsDeleting(true);
    
    try {
      // Extract path from URL for delete operation
      const urlObj = new URL(currentDocumentUrl);
      const pathname = urlObj.pathname;
      const path = pathname.split('/storage/v1/object/public/documents/')[1];
      
      if (path) {
        await deleteDocument(path);
        onUploadComplete('');
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleDownload = () => {
    if (currentDocumentUrl) {
      window.open(currentDocumentUrl, '_blank');
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!imageToProcess) return;
    
    setCropDialogOpen(false);
    
    // Convertir le Blob en File pour l'upload
    const filename = imageToProcess.file.name;
    const fileType = imageToProcess.file.type;
    const croppedFile = new File([croppedImageBlob], filename, { type: fileType });
    
    // Libérer l'URL temporaire
    URL.revokeObjectURL(imageToProcess.tempUrl);
    setImageToProcess(null);
    
    // Uploader l'image recadrée
    await uploadFile(croppedFile);
  };
  
  const handleCropCancel = () => {
    if (imageToProcess) {
      URL.revokeObjectURL(imageToProcess.tempUrl);
      setImageToProcess(null);
    }
    setCropDialogOpen(false);
  };
  
  // Déterminer si le document actuel est une image
  const isImage = currentDocumentUrl && 
    (currentDocumentUrl.toLowerCase().endsWith('.jpg') || 
     currentDocumentUrl.toLowerCase().endsWith('.jpeg') || 
     currentDocumentUrl.toLowerCase().endsWith('.png') ||
     currentDocumentUrl.toLowerCase().includes('image'));

  // Vérifier si c'est un permis de conduire pour activer l'expansion horizontale
  const isDriverLicense = documentType === 'driver-license';
  
  if (isUploading) {
    return (
      <div className="border rounded-lg p-8 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-karrosserie-orange mb-4" />
        <p className="text-sm text-gray-500">Téléchargement en cours...</p>
      </div>
    );
  }
  
  if (currentDocumentUrl) {
    return (
      <>
        {isImage ? (
          <div className="border rounded-lg p-4">
            <div className="mb-4">
              <img 
                src={currentDocumentUrl} 
                alt="Document" 
                className="max-h-40 mx-auto object-contain" 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium truncate">{getFilename(currentDocumentUrl)}</p>
                <p className="text-xs text-gray-500">Image téléchargée</p>
              </div>
              {!isViewMode && (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownload}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-600"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex items-center">
              <FileIcon className="h-10 w-10 text-blue-500 mr-4" />
              <div className="flex-1">
                <p className="font-medium truncate">{getFilename(currentDocumentUrl)}</p>
                <p className="text-xs text-gray-500">Document téléchargé</p>
              </div>
              {!isViewMode && (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownload}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-600"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
  
  // En mode visualisation sans document, ne rien afficher
  if (isViewMode) {
    return (
      <div className="border rounded-lg p-4 text-center text-gray-500">
        <p className="text-sm">Aucun document téléchargé</p>
      </div>
    );
  }
  
  return (
    <>
      <FileUpload
        onUpload={handleUpload}
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
