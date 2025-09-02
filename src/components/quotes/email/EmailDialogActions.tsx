
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface EmailDialogActionsProps {
  onCancel: () => void;
  onSend: () => void;
  isLoading: boolean;
}

const EmailDialogActions: React.FC<EmailDialogActionsProps> = ({
  onCancel,
  onSend,
  isLoading
}) => {
  return (
    <div className="flex justify-end space-x-2 mt-6">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Annuler
      </Button>
      <Button
        onClick={onSend}
        disabled={isLoading}
        variant="send"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

export default EmailDialogActions;
