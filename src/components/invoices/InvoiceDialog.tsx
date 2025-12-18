
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { UseMutationResult } from '@tanstack/react-query';
import { useInvoices } from '@/hooks/use-invoices';

interface InvoiceDialogProps {
  invoice?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  prefillData?: any;
  // Mutations optionnelles - si non fournies, utilise le hook interne
  createInvoice?: UseMutationResult<any, Error, any, unknown>;
  updateInvoice?: UseMutationResult<any, Error, { id: string; data: any }, unknown>;
}

const InvoiceDialog = ({
  invoice,
  open,
  onOpenChange,
  onSuccess,
  prefillData,
  createInvoice,
  updateInvoice
}: InvoiceDialogProps) => {
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Utiliser le hook interne si les mutations ne sont pas fournies
  const { createInvoice: internalCreate, updateInvoice: internalUpdate } = useInvoices();
  const effectiveCreateInvoice = createInvoice || internalCreate;
  const effectiveUpdateInvoice = updateInvoice || internalUpdate;

  console.log('[InvoiceDialog] RENDER - open:', open, 'isSubmitting:', isSubmitting, 'invoiceId:', invoice?.id);

  const isConversionFromRepairOrder = prefillData?.repair_order_id;
  const isEditing = invoice && invoice.id;

  const handleSubmit = async (formData: any) => {
    console.log('[InvoiceDialog] handleSubmit CALLED, isSubmitting:', isSubmitting);
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      let createdInvoice;
      
      if (isEditing) {
        console.log('[InvoiceDialog] Calling updateInvoice...');
        await effectiveUpdateInvoice.mutateAsync({ id: invoice.id, data: formData });
        console.log('[InvoiceDialog] updateInvoice COMPLETED');
      } else {
        console.log('[InvoiceDialog] Calling createInvoice...');
        createdInvoice = await effectiveCreateInvoice.mutateAsync(formData);
        console.log('[InvoiceDialog] createInvoice COMPLETED');
      }
      
      console.log('[InvoiceDialog] Closing dialog...');
      onOpenChange(false);

      if (isConversionFromRepairOrder && createdInvoice) {
        setTimeout(() => {
          navigate(`/documents/factures?openInvoice=${createdInvoice.id}`);
        }, 100);
      }
    } catch (error: any) {
      console.error('[InvoiceDialog] submission error:', error);
    } finally {
      console.log('[InvoiceDialog] handleSubmit FINISHED, setting isSubmitting=false');
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!isSubmitting ? onOpenChange : undefined} modal={false}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {isEditing 
              ? "Modifier la facture" 
              : isConversionFromRepairOrder 
                ? "Convertir en facture" 
                : "Créer une nouvelle facture"
            }
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les détails de la facture."
              : isConversionFromRepairOrder
                ? "Convertissez cet ordre de réparation en facture en ajustant les informations si nécessaire."
                : "Créez une nouvelle facture en remplissant les informations ci-dessous."
            }
          </DialogDescription>
        </DialogHeader>
        
        {open && (
          <InvoiceForm
            invoice={invoice}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
            prefillData={prefillData}
            isConversionFromRepairOrder={isConversionFromRepairOrder}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
