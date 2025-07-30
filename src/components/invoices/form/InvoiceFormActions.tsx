
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Invoice } from '@/services/supabase/invoices';

interface InvoiceFormActionsProps {
  invoice?: Invoice | null;
  isSubmitting: boolean;
  onCancel: () => void;
  isConversionFromRepairOrder?: boolean;
}

export const InvoiceFormActions = ({ invoice, isSubmitting, onCancel, isConversionFromRepairOrder }: InvoiceFormActionsProps) => {
  // Déterminer s'il s'agit d'une modification d'une facture existante ou d'une création
  const isEditing = invoice && invoice.id;
  
  const getButtonText = () => {
    if (isSubmitting) return 'Enregistrement...';
    if (isEditing) return 'Mettre à jour';
    if (isConversionFromRepairOrder) return 'Convertir en facture';
    return 'Créer la facture';
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
