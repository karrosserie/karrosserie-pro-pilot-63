
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RepairOrderForm } from '@/components/repair-orders/RepairOrderForm';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { RepairOrder } from '@/services/supabase/repair-orders';

interface RepairOrderDialogProps {
  order?: RepairOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  prefillData?: any;
}

const RepairOrderDialog = ({
  order,
  open,
  onOpenChange,
  onSuccess,
  prefillData
}: RepairOrderDialogProps) => {
  const { updateOrder, createOrder } = useRepairOrders();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Déterminer si c'est une conversion depuis un devis
  const isConversionFromQuote = prefillData?.quote_id;
  // Déterminer s'il s'agit d'un ordre existant (avec ID) ou d'une création
  const isEditing = order && order.id;

  const handleSubmit = async (formData: Partial<RepairOrder>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      let createdOrder;
      
      if (isEditing) {
        await updateOrder.mutateAsync({ id: order.id, data: formData });
      } else {
        createdOrder = await createOrder.mutateAsync(formData as any);
      }
      
      onOpenChange(false);
      
      // Si c'est une conversion depuis un devis et qu'un ordre a été créé,
      // rediriger vers la page des ordres de réparation avec l'ordre ouvert
      if (isConversionFromQuote && createdOrder?.id) {
        console.log('Redirection vers ordre créé:', createdOrder.id);
        setTimeout(() => {
          navigate(`/documents/ordres?openOrder=${createdOrder.id}`);
        }, 100);
      } else {
        onSuccess?.();
      }
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
            {isEditing 
              ? "Modifier l'ordre de réparation" 
              : isConversionFromQuote 
                ? "Convertir en ordre de réparation" 
                : "Créer un nouvel ordre de réparation"
            }
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les détails de l'ordre de réparation."
              : isConversionFromQuote
                ? "Convertissez ce devis en ordre de réparation en ajustant les informations si nécessaire."
                : "Créez un nouvel ordre de réparation en remplissant les informations ci-dessous."
            }
          </DialogDescription>
        </DialogHeader>
        
        <RepairOrderForm
          order={order}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          prefillData={prefillData}
          isConversionFromQuote={isConversionFromQuote}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RepairOrderDialog;
