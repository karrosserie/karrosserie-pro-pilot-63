
import { useState } from 'react';
import { useStorage } from '@/hooks/use-storage';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UseDocumentUploadProps {
  documentType: string;
  documentId: string;
  onUploadComplete: (url: string) => void;
}

export function useDocumentUpload({
  documentType,
  documentId,
  onUploadComplete
}: UseDocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { uploadDocument, deleteDocument } = useStorage();
  const { toast } = useToast();
  const { user } = useAuth();

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

  const handleDelete = async (documentUrl: string) => {
    if (!documentUrl || !user) return;
    
    setIsDeleting(true);
    
    try {
      const urlObj = new URL(documentUrl);
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

  return {
    isUploading,
    isDeleting,
    uploadFile,
    handleDelete
  };
}
