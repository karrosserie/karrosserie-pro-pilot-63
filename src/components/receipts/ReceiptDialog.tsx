
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReceiptForm } from './ReceiptForm';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { Receipt } from './form/types';

interface ReceiptDialogProps {
  receipt?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReceiptDialog = ({ receipt, open, onOpenChange }: ReceiptDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createReceipt, updateReceipt } = useReceiptsData();

  const handleSubmit = async (formData: Receipt) => {
    setIsSubmitting(true);
    try {
      // Find the invoice by reference to get the invoice_id
      let invoice_id = null;
      if (formData.invoice) {
        // For now, we'll use the invoice reference as a string
        // In a real implementation, you'd want to find the actual invoice ID
        invoice_id = formData.invoice;
      }

      const receiptData = {
        reference: formData.reference,
        date: formData.date,
        amount: formData.amount,
        status: formData.status,
        payment_method: formData.payment_method,
        bank_account: formData.bank_account,
        notes: formData.notes || '',
        payment_proofs: formData.payment_proofs || [],
        invoice_id
      };

      if (receipt?.id) {
        await updateReceipt.mutateAsync({ id: receipt.id, data: receiptData });
      } else {
        await createReceipt.mutateAsync(receiptData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting receipt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {receipt ? 'Modifier l\'encaissement' : 'Nouvel encaissement'}
          </DialogTitle>
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
