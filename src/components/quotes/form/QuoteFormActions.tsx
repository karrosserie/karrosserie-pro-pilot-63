
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Quote } from '@/services/supabase/quotes';

interface QuoteFormActionsProps {
  quote?: Quote | null;
  isSubmitting: boolean;
  onCancel: () => void;
  isConversionFromReport?: boolean;
}

export const QuoteFormActions = ({ quote, isSubmitting, onCancel, isConversionFromReport }: QuoteFormActionsProps) => {
  // Déterminer si c'est une modification (devis existant avec ID)
  const isEditing = quote && quote.id;
  
  const getButtonText = () => {
    if (isSubmitting) return 'Enregistrement...';
    if (isEditing) return 'Mettre à jour';
    if (isConversionFromReport) return 'Convertir en devis';
    return 'Créer le devis';
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
