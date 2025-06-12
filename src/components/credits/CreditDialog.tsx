
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditForm } from './form/CreditForm';
import { EditCreditForm } from './form/EditCreditForm';
import { Credit } from '@/services/supabase/credits';

interface CreditDialogProps {
  credit?: Credit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditDialog = ({ credit, open, onOpenChange }: CreditDialogProps) => {
  const isEditing = !!credit;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier l\'avoir' : 'Créer un nouvel avoir'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les informations de cet avoir.'
              : 'Créez un avoir pour rembourser ou créditer un client suite à une facture.'
            }
          </DialogDescription>
        </DialogHeader>
        {isEditing ? (
          <EditCreditForm credit={credit} onClose={() => onOpenChange(false)} />
        ) : (
          <CreditForm onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};
