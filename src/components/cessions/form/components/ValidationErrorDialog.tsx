
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

interface ValidationErrorDialogProps {
  isOpen: boolean;
  errorMessage: string | null;
  onClose: () => void;
}

export const ValidationErrorDialog = ({
  isOpen,
  errorMessage,
  onClose
}: ValidationErrorDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Données incomplètes</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={onClose}
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          >
            Compris
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
