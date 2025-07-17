
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
  isViewMode?: boolean;
}

export const CreditDialog = ({ open, onOpenChange, credit, isViewMode = false }: CreditDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isViewMode ? 'Voir l\'avoir' : 'Créer un avoir'}</DialogTitle>
          <DialogDescription>
            {isViewMode
              ? "Consultez les détails de l'avoir."
              : "Créez un nouvel avoir en remplissant les informations ci-dessous."
            }
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
