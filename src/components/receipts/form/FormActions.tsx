
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
  onCancel: () => void;
}

export const FormActions = ({ isSubmitting, isEditMode, onCancel }: FormActionsProps) => {
  return (
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
        {isSubmitting ? "Enregistrement..." : (isEditMode ? "Modifier" : "Créer")}
      </Button>
    </div>
  );
};
