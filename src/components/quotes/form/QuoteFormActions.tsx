
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Quote } from '@/services/supabase/quotes';

interface QuoteFormActionsProps {
  quote?: Quote | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const QuoteFormActions = ({ quote, isSubmitting, onCancel }: QuoteFormActionsProps) => {
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
          {isSubmitting ? 'Enregistrement...' : quote ? 'Mettre à jour' : 'Créer le devis'}
        </Button>
      </div>
    </>
  );
};
