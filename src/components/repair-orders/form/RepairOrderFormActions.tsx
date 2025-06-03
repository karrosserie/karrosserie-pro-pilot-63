
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RepairOrder } from '@/services/supabase/repair-orders';

interface RepairOrderFormActionsProps {
  order?: RepairOrder | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const RepairOrderFormActions = ({ order, isSubmitting, onCancel }: RepairOrderFormActionsProps) => {
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
          {isSubmitting ? 'Enregistrement...' : order ? 'Mettre à jour' : "Créer l'ordre de réparation"}
        </Button>
      </div>
    </>
  );
};
