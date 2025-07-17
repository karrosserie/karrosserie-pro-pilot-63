
import React, { useState } from 'react';
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
  isViewMode?: boolean;
}

const RepairOrderDialog = ({
  order,
  open,
  onOpenChange,
  isViewMode = false
}: RepairOrderDialogProps) => {
  const { updateOrder, createOrder } = useRepairOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Déterminer s'il s'agit d'un ordre existant (avec ID) ou d'une création
  const isExistingOrder = order && order.id;

  const handleSubmit = async (formData: Partial<RepairOrder>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (isExistingOrder) {
        await updateOrder.mutateAsync({ id: order.id, data: formData });
      } else {
        await createOrder.mutateAsync(formData as any);
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
            {isViewMode 
              ? "Visualiser l'ordre de réparation"
              : isExistingOrder 
                ? "Modifier l'ordre de réparation" 
                : "Créer un nouvel ordre de réparation"
            }
          </DialogTitle>
          <DialogDescription>
            {isViewMode
              ? "Consultez les détails de l'ordre de réparation."
              : isExistingOrder
                ? "Modifiez les détails de l'ordre de réparation."
                : "Créez un nouvel ordre de réparation en remplissant les informations ci-dessous."
            }
          </DialogDescription>
        </DialogHeader>
        
        <RepairOrderForm
          order={order}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RepairOrderDialog;
