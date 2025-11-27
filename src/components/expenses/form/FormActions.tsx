
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isAnalyzing?: boolean;
  expense?: any;
}

export const FormActions = ({ onCancel, isSubmitting, isAnalyzing, expense }: FormActionsProps) => {
  const isDisabled = isSubmitting || isAnalyzing;
  
  const getButtonText = () => {
    if (isAnalyzing) return "Analyse en cours...";
    if (isSubmitting) return "Enregistrement...";
    return expense ? "Modifier" : "Créer";
  };

  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isDisabled}
      >
        Annuler
      </Button>
      <Button 
        type="submit" 
        disabled={isDisabled}
        className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
      >
        {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {getButtonText()}
      </Button>
    </div>
  );
};
