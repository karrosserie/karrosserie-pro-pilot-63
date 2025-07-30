
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RepairOrder } from '@/services/supabase/repair-orders';

interface RepairOrderFormActionsProps {
  order?: RepairOrder | null;
  isSubmitting: boolean;
  onCancel: () => void;
  isConversionFromQuote?: boolean;
}

export const RepairOrderFormActions = ({ order, isSubmitting, onCancel, isConversionFromQuote }: RepairOrderFormActionsProps) => {
  // Déterminer s'il s'agit d'une modification d'un ordre existant ou d'une création
  const isEditing = order && order.id;
  
  const getButtonText = () => {
    if (isSubmitting) return 'Enregistrement...';
    if (isEditing) return 'Mettre à jour';
    if (isConversionFromQuote) return 'Convertir en ordre de réparation';
    return "Créer l'ordre de réparation";
  };

  return (
    <>
      <Separator />
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
        >
          {getButtonText()}
        </Button>
      </div>
    </>
  );
};
