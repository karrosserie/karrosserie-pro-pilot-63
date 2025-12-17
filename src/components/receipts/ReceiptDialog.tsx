
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
import { Invoice } from '@/services/supabase/invoices';

interface ReceiptDialogProps {
  receipt?: Receipt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedInvoice?: { id: string; amount: number } | null;
  // Props optionnelles - si non fournies, utilise valeurs par défaut
  invoices?: Invoice[];
  invoicesLoading?: boolean;
}

const ReceiptDialog = ({
  receipt,
  open,
  onOpenChange,
  preselectedInvoice,
  invoices = [],
  invoicesLoading = false
}: ReceiptDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (formData: Receipt) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      let amount = 0;
      if (typeof formData.amount === 'string') {
        amount = formData.amount.trim() === '' ? 0 : parseFloat(formData.amount);
      } else {
        amount = formData.amount || 0;
      }

      let invoiceId = null;
      if (formData.invoice && formData.invoice.trim() !== '') {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(formData.invoice)) {
          invoiceId = formData.invoice;
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

      if (receipt?.id) {
        await receiptMutations.update(receipt.id, dataToSubmit);
      } else {
        await receiptMutations.create(dataToSubmit);
      }

      toast({
        title: receipt ? "Encaissement modifié" : "Encaissement créé",
        description: receipt ? `L'encaissement a été modifié avec succès.` : "Le nouvel encaissement a été créé avec succès."
      });
      
      onOpenChange(false);
      setTimeout(() => { queryClient.invalidateQueries({ queryKey: ['receipts'] }); }, 100);
    } catch (error) {
      console.error('Error saving receipt:', error);
      toast({ title: "Erreur", description: "Une erreur est survenue lors de l'enregistrement.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!isSubmitting ? onOpenChange : undefined} modal={false}>
      <DialogContent className="max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{receipt ? `Modifier l'encaissement` : "Nouvel encaissement"}</DialogTitle>
          <DialogDescription>{receipt ? "Modifiez les détails de l'encaissement." : "Créez un nouvel encaissement en remplissant les informations ci-dessous."}</DialogDescription>
        </DialogHeader>
        {open && (
          <ReceiptForm
            receipt={receipt}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
            preselectedInvoice={preselectedInvoice}
            invoices={invoices}
            invoicesLoading={invoicesLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
