
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

  const isConversionFromRepairOrder = prefillData?.repair_order_id;
  const isEditing = invoice && invoice.id;

  const handleSubmit = async (formData: any) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      let createdInvoice;
      
      if (isEditing) {
        await updateInvoice.mutateAsync({ id: invoice.id, data: formData });
      } else {
        createdInvoice = await createInvoice.mutateAsync(formData);
      }
      
      onOpenChange(false);

      if (isConversionFromRepairOrder && createdInvoice) {
        setTimeout(() => {
          navigate(`/documents/factures?openInvoice=${createdInvoice.id}`);
        }, 100);
      }
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
