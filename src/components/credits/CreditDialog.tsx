
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
  credit?: { invoice_id: string; reference: string; status: string; amount: number; notes: string } | null;
}

export const CreditDialog = ({ open, onOpenChange, credit }: CreditDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un avoir</DialogTitle>
          <DialogDescription>
            Créez un nouvel avoir en remplissant les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>
        
        <CreditForm 
          onClose={() => onOpenChange(false)}
          preselectedInvoice={credit}
        />
      </DialogContent>
    </Dialog>
  );
};
