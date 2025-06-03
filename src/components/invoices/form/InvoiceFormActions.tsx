
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Invoice } from '@/services/supabase/invoices';

interface InvoiceFormActionsProps {
  invoice?: Invoice | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const InvoiceFormActions = ({ invoice, isSubmitting, onCancel }: InvoiceFormActionsProps) => {
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
          {isSubmitting ? 'Enregistrement...' : invoice ? 'Mettre à jour' : 'Créer la facture'}
        </Button>
      </div>
    </>
  );
};
