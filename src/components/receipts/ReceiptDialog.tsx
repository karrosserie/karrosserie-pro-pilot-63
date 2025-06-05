
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReceiptForm } from './ReceiptForm';
import { useToast } from '@/hooks/use-toast';
import { Receipt } from './form/types';
import { receiptMutations } from '@/services/supabase/receipts/mutations';

interface ReceiptDialogProps {
  receipt?: Receipt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReceiptDialog = ({
  receipt,
  open,
  onOpenChange
}: ReceiptDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: Receipt) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Ensure amount is properly converted to number, handle empty strings
      let amount = 0;
      if (typeof formData.amount === 'string') {
        amount = formData.amount.trim() === '' ? 0 : parseFloat(formData.amount);
      } else {
        amount = formData.amount || 0;
      }
      
      const dataToSubmit = {
        reference: formData.reference || '',
        date: formData.date,
        amount: amount,
        status: formData.status,
        payment_method: formData.payment_method,
        bank_account: formData.bank_account,
        notes: formData.notes || '',
        payment_proofs: formData.payment_proofs || [],
        invoice_id: formData.invoice || null
      };

      console.log('Submitting receipt data:', dataToSubmit);

      if (receipt?.id) {
        await receiptMutations.update(receipt.id, dataToSubmit);
      } else {
        await receiptMutations.create(dataToSubmit);
      }
      
      toast({
        title: receipt ? "Encaissement modifié" : "Encaissement créé",
        description: receipt 
          ? `L'encaissement a été modifié avec succès.`
          : "Le nouvel encaissement a été créé avec succès."
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving receipt:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!isSubmitting ? onOpenChange : undefined}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {receipt ? `Modifier l'encaissement` : "Nouvel encaissement"}
          </DialogTitle>
          <DialogDescription>
            {receipt
              ? "Modifiez les détails de l'encaissement."
              : "Créez un nouvel encaissement en remplissant les informations ci-dessous."
            }
          </DialogDescription>
        </DialogHeader>
        
        <ReceiptForm
          receipt={receipt}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
