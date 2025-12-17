
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
import { useQueryClient } from '@tanstack/react-query';

interface ReceiptDialogProps {
  receipt?: Receipt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedInvoice?: { id: string; amount: number } | null;
}

const ReceiptDialog = ({
  receipt,
  open,
  onOpenChange,
  preselectedInvoice
}: ReceiptDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      // Validate and clean invoice_id - must be a valid UUID or null
      let invoiceId = null;
      if (formData.invoice && formData.invoice.trim() !== '') {
        // Check if it's a valid UUID format (basic check)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(formData.invoice)) {
          invoiceId = formData.invoice;
        } else {
          console.warn('Invalid UUID format for invoice_id:', formData.invoice);
          // If it's not a valid UUID, set to null instead of causing an error
          invoiceId = null;
        }
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
        invoice_id: invoiceId
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
      
      // Fermer le dialog AVANT d'invalider pour éviter le freeze
      onOpenChange(false);
      
      // Invalider uniquement les receipts - les invoices seront rafraîchies par le composant parent si nécessaire
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['receipts'] });
      }, 100);
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
        
        {open && (
          <ReceiptForm
            receipt={receipt}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
            preselectedInvoice={preselectedInvoice}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
