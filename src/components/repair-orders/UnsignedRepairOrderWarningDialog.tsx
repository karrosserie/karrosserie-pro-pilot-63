import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface UnsignedRepairOrderWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  orderReference?: string;
}

export function UnsignedRepairOrderWarningDialog({
  open,
  onOpenChange,
  onConfirm,
  orderReference
}: UnsignedRepairOrderWarningDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Ordre de réparation non signé
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 text-left">
            <p>
              L'ordre de réparation <strong>{orderReference}</strong> n'a pas été signé par le client.
            </p>
            <p className="text-amber-700 font-medium">
              ⚠️ Attention : En l'absence de signature, vous n'êtes pas certain d'être payé pour ces travaux.
            </p>
            <p className="text-destructive font-medium">
              📋 Note légale : Sans signature du client, Karrosserie.pro ne peut pas vous couvrir juridiquement en cas de litige.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Continuer quand même
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
