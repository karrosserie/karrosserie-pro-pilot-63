
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditForm } from './form/CreditForm';

interface CreditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditDialog = ({ open, onOpenChange }: CreditDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouvel avoir</DialogTitle>
          <DialogDescription>
            Créez un avoir pour rembourser ou créditer un client suite à une facture.
          </DialogDescription>
        </DialogHeader>
        <CreditForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
