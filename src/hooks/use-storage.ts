
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/supabase/storage';
import { useToast } from '@/hooks/use-toast';

export function useStorage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const uploadDocument = async (file: File, documentType: string, documentId: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour télécharger un document.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      const publicUrl = await storageService.uploadDocument(file, user.id, documentType, documentId);
      toast({
        title: "Document téléchargé",
        description: "Le document a été téléchargé avec succès."
      });
      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de télécharger le document: ${error.message}`,
        variant: "destructive"
      });
      return null;
    }
  };
  
  const getDocumentUrl = (filePath: string) => {
    return storageService.getDocumentUrl(filePath);
  };
  
  const deleteDocument = async (filePath: string) => {
    try {
      await storageService.deleteDocument(filePath);
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès."
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le document: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }
  };
  
  const listDocuments = async (documentType: string, documentId: string) => {
    if (!user) return [];
    
    try {
      return await storageService.listDocuments(user.id, documentType, documentId);
    } catch (error) {
      console.error('Error listing documents:', error);
      return [];
    }
  };
  
  return {
    uploadDocument,
    getDocumentUrl,
    deleteDocument,
    listDocuments
  };
}
