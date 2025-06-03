
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { useInvoices } from '@/hooks/use-invoices';
import { Invoice } from '@/services/supabase/invoices';

interface InvoiceDialogProps {
  invoice?: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoiceDialog = ({
  invoice,
  open,
  onOpenChange
}: InvoiceDialogProps) => {
  const { updateInvoice, createInvoice } = useInvoices();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: Partial<Invoice>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (invoice && invoice.id) {
        await updateInvoice.mutateAsync({ id: invoice.id, data: formData });
      } else {
        await createInvoice.mutateAsync(formData as any);
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error('Dialog submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!isSubmitting ? onOpenChange : undefined}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {invoice ? `Modifier la facture - ${invoice.reference}` : "Créer une nouvelle facture"}
          </DialogTitle>
          <DialogDescription>
            {invoice
              ? "Modifiez les détails de la facture."
              : "Créez une nouvelle facture en remplissant les informations ci-dessous."
            }
          </DialogDescription>
        </DialogHeader>
        
        <InvoiceForm
          invoice={invoice}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
