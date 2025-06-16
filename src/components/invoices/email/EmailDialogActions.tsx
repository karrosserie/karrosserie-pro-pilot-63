
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface EmailDialogActionsProps {
  onCancel: () => void;
  onSend: () => void;
  isLoading: boolean;
  isFormValid: boolean;
}

export const EmailDialogActions = ({ 
  onCancel, 
  onSend, 
  isLoading, 
  isFormValid 
}: EmailDialogActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={isLoading}
      >
        Annuler
      </Button>
      <Button 
        onClick={onSend}
        disabled={isLoading || !isFormValid}
        className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
      >
        {isLoading ? (
          <>
            <Mail className="h-4 w-4 mr-2 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Mail className="h-4 w-4 mr-2" />
            Envoyer
          </>
        )}
      </Button>
    </div>
  );
};
