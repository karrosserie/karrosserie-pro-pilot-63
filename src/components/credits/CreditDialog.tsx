import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditForm } from './form/CreditForm';
import { useCredits } from '@/hooks/use-credits';
import { UseMutationResult } from '@tanstack/react-query';

interface CreditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credit?: { invoice_id: string; reference: string; status: string; amount: number; notes: string } | null;
  // Mutation optionnelle - si non fournie, utilise hook interne
  createCredit?: UseMutationResult<any, Error, any, unknown>;
}

export const CreditDialog = ({ open, onOpenChange, credit, createCredit: externalCreateCredit }: CreditDialogProps) => {
  // Utilise le hook uniquement si mutation non fournie en props
  const { createCredit: hookCreateCredit } = useCredits();
  const createCredit = externalCreateCredit || hookCreateCredit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un avoir</DialogTitle>
          <DialogDescription>Créez un nouvel avoir en remplissant les informations ci-dessous.</DialogDescription>
        </DialogHeader>
        {open && (
          <CreditForm 
            onClose={() => onOpenChange(false)}
            preselectedInvoice={credit}
            createCredit={createCredit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
