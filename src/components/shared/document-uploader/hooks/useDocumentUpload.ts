
import { useState } from 'react';
import { useStorage } from '@/hooks/use-storage';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAIDocumentProcessing } from '@/hooks/use-ai-document-processing';

interface UseDocumentUploadProps {
  documentType: string;
  documentId: string;
  onUploadComplete: (url: string) => void;
  requiresAIProcessing?: boolean;
}

export function useDocumentUpload({
  documentType,
  documentId,
  onUploadComplete,
  requiresAIProcessing = false
}: UseDocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { uploadDocument, deleteDocument } = useStorage();
  const { toast } = useToast();
  const { user } = useAuth();

  const { isProcessing, progress, currentMessage, startProcessing } = useAIDocumentProcessing({
    onComplete: async (file: File) => {
      await performUpload(file);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive"
      });
      setIsUploading(false);
    }
  });

  const performUpload = async (file: File) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour télécharger un document.",
        variant: "destructive"
      });
      setIsUploading(false);
      return;
    }
    
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

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    
    if (requiresAIProcessing) {
      // Store the file temporarily and start AI processing
      (startProcessing as any).currentFile = file;
      startProcessing();
    } else {
      await performUpload(file);
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
    isUploading: isUploading || isProcessing,
    isDeleting,
    isProcessing,
    progress,
    currentMessage,
    uploadFile,
    handleDelete
  };
}
