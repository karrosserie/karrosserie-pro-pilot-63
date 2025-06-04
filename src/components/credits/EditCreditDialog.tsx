
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditCreditForm } from './form/EditCreditForm';

interface EditCreditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditId: string;
  initialData?: {
    reference: string;
    client_id: string | null;
    vehicle_id: string | null;
    invoice_id: string | null;
    status: 'En attente' | 'Payé';
    notes?: string;
    items?: any[];
  };
}

export const EditCreditDialog = ({ 
  open, 
  onOpenChange, 
  creditId, 
  initialData 
}: EditCreditDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'avoir</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'avoir {initialData?.reference}.
          </DialogDescription>
        </DialogHeader>
        <EditCreditForm 
          creditId={creditId}
          initialData={initialData}
          onClose={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};
