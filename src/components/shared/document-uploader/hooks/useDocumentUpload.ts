import { useState } from 'react';
import { useStorage } from '@/hooks/use-storage';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UseDocumentUploadProps {
  documentType: string;
  documentId: string;
  onUploadComplete: (url: string) => void;
  onAnalysisComplete?: (data: any) => void;
}

export function useDocumentUpload({
  documentType,
  documentId,
  onUploadComplete,
  onAnalysisComplete
}: UseDocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    
    console.log('Starting upload process...', { documentType });
    setIsUploading(true);
    
    // Si c'est une preuve d'achat, commencer l'analyse dès maintenant
    if (documentType === 'expense-proof') {
      console.log('Setting isAnalyzing to true for expense-proof');
      setIsAnalyzing(true);
    }
    
    try {
      console.log('Uploading file to storage...', { userId: user.id, documentType, documentId });
      const url = await uploadDocument(file, documentType, documentId);
      console.log('Upload successful, URL:', url);
      
      if (url) {
        // D'abord appeler onUploadComplete pour afficher le document
        onUploadComplete(url);
        toast({
          title: "Document téléchargé",
          description: "Le document a été téléchargé avec succès."
        });

        // Si c'est une preuve d'achat, appeler l'API d'analyse
        if (documentType === 'expense-proof') {
          try {
            console.log('Sending file to analysis API...');
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('https://n8n.karrosserie.pro/webhook/03a02244-0f87-4762-8578-00734c3ad6ab', {
              method: 'POST',
              body: formData
            });
            
            if (response.ok) {
              console.log('File sent to analysis API successfully');
              const rawData = await response.json();
              console.log('Raw analysis data received:', rawData);
              
              // L'API retourne les données dans rawData.output comme chaîne JSON
              if (rawData.output) {
                try {
                  // Extraire le JSON de la chaîne output
                  const jsonMatch = rawData.output.match(/```json\s*([\s\S]*?)\s*```/);
                  if (jsonMatch && jsonMatch[1]) {
                    const analysisData = JSON.parse(jsonMatch[1]);
                    console.log('Parsed analysis data:', analysisData);
                    
                    // Appeler le callback avec les données analysées
                    if (onAnalysisComplete && analysisData) {
                      onAnalysisComplete(analysisData);
                    }
                  }
                } catch (error) {
                  console.error('Error parsing analysis data:', error);
                }
              }
            } else {
              console.warn('Analysis API call failed:', response.status, response.statusText);
            }
          } catch (apiError) {
            console.error('Error calling analysis API:', apiError);
            // Ne pas bloquer le processus principal si l'API d'analyse échoue
          }
        }
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
      // Reset l'état d'analyse dans tous les cas
      if (documentType === 'expense-proof') {
        setIsAnalyzing(false);
      }
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
    isAnalyzing,
    uploadFile,
    handleDelete
  };
}