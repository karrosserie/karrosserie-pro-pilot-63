
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CessionForm } from './CessionForm';
import { Cession } from '@/services/supabase/cessions';

interface CessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cession?: Cession | null;
  onSubmit: (formData: Partial<Cession>) => Promise<void>;
  isSubmitting?: boolean;
}

export const CessionDialog = ({
  open,
  onOpenChange,
  cession,
  onSubmit,
  isSubmitting = false
}: CessionDialogProps) => {
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {cession ? 'Modifier la cession' : 'Nouvelle cession de créance'}
          </DialogTitle>
          <DialogDescription>
            {cession 
              ? 'Saisissez les informations nécessaires pour modifier la cession de créance avec la compagnie d\'assurance.'
              : 'Saisissez les informations nécessaires pour créer une cession de créance avec la compagnie d\'assurance.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <CessionForm
          cession={cession}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
