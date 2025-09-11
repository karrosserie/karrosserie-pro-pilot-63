
import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { sendDocumentsRequest } from '@/services/documentsRequestService';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ValidationErrorDialogProps {
  isOpen: boolean;
  errorMessage: string | null;
  onClose: () => void;
  client?: any;
  companyId?: string;
}

export const ValidationErrorDialog = ({
  isOpen,
  errorMessage,
  onClose,
  client,
  companyId
}: ValidationErrorDialogProps) => {
  const { toast } = useToast();
  const [isRequestingDocuments, setIsRequestingDocuments] = useState(false);

  const handleRequestDocuments = async () => {
    if (!client?.id) {
      toast({
        title: "Erreur",
        description: "Impossible d'identifier le client pour envoyer la demande de documents.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsRequestingDocuments(true);
      await sendDocumentsRequest(client.id, companyId);
      toast({
        title: "Demande envoyée",
        description: "La demande de documents a été envoyée au client avec succès."
      });
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande de documents.",
        variant: "destructive"
      });
    } finally {
      setIsRequestingDocuments(false);
    }
  };

  // Vérifier si le message d'erreur contient des documents manquants
  const hasDocumentErrors = errorMessage && (
    errorMessage.includes('permis de conduire') || 
    errorMessage.includes('certificat d\'immatriculation')
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Données incomplètes</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          {hasDocumentErrors && client && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRequestDocuments}
              disabled={isRequestingDocuments}
              className="w-full sm:w-auto"
            >
              <Send className="h-4 w-4 mr-2" />
              {isRequestingDocuments ? 'Envoi en cours...' : 'Demander les documents'}
            </Button>
          )}
          <AlertDialogAction 
            onClick={onClose}
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 w-full sm:w-auto"
          >
            Compris
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
