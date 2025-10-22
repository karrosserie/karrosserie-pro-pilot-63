import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from 'lucide-react';

interface CessionModificatifWarningProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const CessionModificatifWarning = ({
  open,
  onOpenChange,
  onConfirm
}: CessionModificatifWarningProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <AlertDialogTitle>Devis modifié détecté</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              <strong>Attention:</strong> Ce devis a été modifié par rapport au rapport d'expert initial.
            </p>
            <p className="text-sm">
              La création d'une cession de créance nécessite normalement un <strong>rapport modificatif</strong> de l'expert pour être valide.
            </p>
            <p className="text-sm font-medium">
              Confirmez-vous avoir reçu le rapport modificatif ?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col xs:flex-row gap-2">
          <AlertDialogCancel>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirmer - J'ai le modificatif
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
