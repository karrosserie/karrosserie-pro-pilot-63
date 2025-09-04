
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';

interface FormActionsProps {
  report?: ExpertiseReport | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const FormActions = ({ report, isSubmitting, onCancel }: FormActionsProps) => {
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
          variant="validation"
        >
          {isSubmitting ? 'Enregistrement...' : report ? 'Mettre à jour' : 'Créer le rapport'}
        </Button>
      </div>
    </>
  );
};
