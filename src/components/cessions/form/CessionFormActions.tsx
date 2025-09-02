
import React from 'react';
import { Button } from '@/components/ui/button';
import { Cession } from '@/services/supabase/cessions';

interface CessionFormActionsProps {
  cession?: Cession | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const CessionFormActions = ({
  cession,
  isSubmitting,
  onCancel
}: CessionFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t">
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
        variant="validation"
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? (cession ? 'Modification...' : 'Création...') 
          : (cession ? 'Modifier' : 'Créer')
        }
      </Button>
    </div>
  );
};
