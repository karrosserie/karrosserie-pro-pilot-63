
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
import { useToast } from '@/hooks/use-toast';

interface InvoiceDialogProps {
  invoice?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoiceDialog = ({
  invoice,
  open,
  onOpenChange
}: InvoiceDialogProps) => {
  const { toast } = useToast();
  const { updateInvoice, createInvoice } = useInvoices();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (invoice && invoice.id) {
        await updateInvoice.mutateAsync({ id: invoice.id, data: formData });
      } else {
        await createInvoice.mutateAsync(formData);
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {invoice && invoice.id ? "Modifier la facture" : "Créer une nouvelle facture"}
          </DialogTitle>
          <DialogDescription>
            {invoice && invoice.id
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
