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

interface ModificatifAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueWithout: () => void;
  onRequestModificatif: () => void;
}

export const ModificatifAlert = ({
  open,
  onOpenChange,
  onContinueWithout,
  onRequestModificatif
}: ModificatifAlertProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <AlertDialogTitle>Modification d'un devis lié à un rapport d'expert</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              Ce devis est lié à un rapport d'expert. Les modifications peuvent <strong>invalider une éventuelle cession de créance</strong>.
            </p>
            <p className="text-sm">
              Pour conserver la validité de la cession, un <strong>rapport modificatif</strong> doit être demandé à l'expert.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col xs:flex-row gap-2">
          <AlertDialogCancel onClick={onContinueWithout}>
            Continuer sans modificatif
          </AlertDialogCancel>
          <AlertDialogAction onClick={onRequestModificatif} className="bg-primary">
            Demander un modificatif
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
