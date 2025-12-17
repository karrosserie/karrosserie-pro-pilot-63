
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
import { useInvoices } from '@/hooks/use-invoices';

interface InvoiceDialogProps {
  invoice?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  prefillData?: any;
}

const InvoiceDialog = ({
  invoice,
  open,
  onOpenChange,
  onSuccess,
  prefillData
}: InvoiceDialogProps) => {
  const navigate = useNavigate();
  const { updateInvoice, createInvoice } = useInvoices();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Déterminer si c'est une conversion depuis un ordre de réparation
  const isConversionFromRepairOrder = prefillData?.repair_order_id;
  // Déterminer si c'est une modification (facture existante avec ID)
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
      
      // Fermer le dialog après succès - l'invalidation des queries via use-invoices suffit
      onOpenChange(false);

      // Si c'est une conversion depuis un ordre de réparation et qu'une facture a été créée,
      // rediriger vers la page des factures avec la facture ouverte
      if (isConversionFromRepairOrder && createdInvoice) {
        setTimeout(() => {
          navigate(`/documents/factures?openInvoice=${createdInvoice.id}`);
        }, 100);
      }
      // Supprimé: onSuccess?.() - l'invalidation via React Query est suffisante
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
