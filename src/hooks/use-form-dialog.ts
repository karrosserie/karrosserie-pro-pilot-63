import { useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseFormDialogOptions {
  hasUnsavedChanges?: boolean;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
}

export const useFormDialog = ({ 
  hasUnsavedChanges = false, 
  isSubmitting = false, 
  onOpenChange 
}: UseFormDialogOptions) => {
  const { toast } = useToast();
  const confirmingClose = useRef(false);

  const handleOpenChange = useCallback((open: boolean) => {
    // Si on veut ouvrir le modal, pas de problème
    if (open) {
      onOpenChange(open);
      return;
    }

    // Si on est en train de soumettre, empêcher la fermeture
    if (isSubmitting) {
      return;
    }

    // Si pas de changements non sauvegardés, fermer directement
    if (!hasUnsavedChanges) {
      onOpenChange(open);
      return;
    }

    // Si on a déjà confirmé la fermeture, fermer directement
    if (confirmingClose.current) {
      confirmingClose.current = false;
      onOpenChange(open);
      return;
    }

    // Sinon, demander confirmation
    toast({
      title: "Données non sauvegardées",
      description: "Vous avez des modifications non sauvegardées. Cliquez à nouveau pour fermer sans sauvegarder.",
      variant: "destructive"
    });

    // Marquer qu'on a affiché la confirmation
    confirmingClose.current = true;
    
    // Réinitialiser après 5 secondes
    setTimeout(() => {
      confirmingClose.current = false;
    }, 5000);
  }, [hasUnsavedChanges, isSubmitting, onOpenChange, toast]);

  return { 
    handleOpenChange,
    // Pour empêcher complètement le clic extérieur pendant la soumission
    preventClose: isSubmitting
  };
};