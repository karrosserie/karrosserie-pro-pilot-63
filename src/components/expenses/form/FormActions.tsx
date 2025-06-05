
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  expense?: any;
}

export const FormActions = ({ onCancel, isSubmitting, expense }: FormActionsProps) => {
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
        {isSubmitting ? "Enregistrement..." : (expense ? "Modifier" : "Créer")}
      </Button>
    </div>
  );
};
