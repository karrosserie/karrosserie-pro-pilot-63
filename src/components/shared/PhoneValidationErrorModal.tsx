import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, UserPen } from 'lucide-react';

interface PhoneValidationErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  clientName?: string;
  onEditClient?: () => void;
}

export const PhoneValidationErrorModal: React.FC<PhoneValidationErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
  clientName,
  onEditClient
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Numéro de téléphone invalide
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {clientName && (
                <p className="text-sm text-muted-foreground">
                  Client concerné : <span className="font-medium text-foreground">{clientName}</span>
                </p>
              )}
              
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>

              <div className="bg-muted rounded-md p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  Format attendu :
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  +336XXXXXXXX ou +337XXXXXXXX
                </p>
                <p className="text-xs text-muted-foreground">
                  (Numéro mobile français avec indicatif +33)
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          {onEditClient && (
            <Button 
              variant="default" 
              onClick={() => {
                onEditClient();
                onClose();
              }}
              className="w-full sm:w-auto"
            >
              <UserPen className="h-4 w-4 mr-2" />
              Modifier le client
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Fermer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
