
import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Loader2, FileIcon, DownloadIcon, Trash2 } from 'lucide-react';
import { useStorage } from '@/hooks/use-storage';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentUploaderProps {
  documentType: string;
  documentId: string;
  currentDocumentUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

export function DocumentUploader({
  documentType,
  documentId,
  currentDocumentUrl,
  onUploadComplete
}: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      const url = await uploadDocument(file, documentType, documentId);
      if (url) {
        onUploadComplete(url);
      }
    } catch (error) {
      console.error('Upload error:', error);
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
      <div className="border rounded-lg p-4">
        <div className="flex items-center">
          <FileIcon className="h-10 w-10 text-blue-500 mr-4" />
          <div className="flex-1">
            <p className="font-medium truncate">{getFilename(currentDocumentUrl)}</p>
            <p className="text-xs text-gray-500">Document téléchargé</p>
          </div>
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
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <FileUpload
      onUpload={handleUpload}
      accept=".pdf,.jpg,.jpeg,.png"
      maxSize={10}
    />
  );
}
