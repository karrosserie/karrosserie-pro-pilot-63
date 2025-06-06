
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Cession } from '@/services/supabase/cessions';
import { CessionBasicInfoSection } from './form/CessionBasicInfoSection';
import { CessionFormActions } from './form/CessionFormActions';
import { useCessionFormLogic } from './form/useCessionFormLogic';

interface CessionFormProps {
  cession?: Cession | null;
  onSubmit: (formData: Partial<Cession>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const CessionForm = ({
  cession,
  onSubmit,
  onCancel,
  isSubmitting
}: CessionFormProps) => {
  const { toast } = useToast();
  
  const {
    formData,
    errors,
    isReadOnly,
    validationErrorMessage,
    handleChange,
    validateForm,
    prepareSubmitData,
    clearValidationError
  } = useCessionFormLogic({ cession });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started...');
    console.log('isSubmitting:', isSubmitting);
    
    if (isSubmitting) {
      console.log('Already submitting, skipping...');
      return;
    }
    
    console.log('Starting form validation...');
    if (!validateForm()) {
      console.log('Form validation failed');
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log('Form validation passed, preparing data...');
      const submitData = prepareSubmitData();
      console.log('Calling onSubmit with data:', submitData);
      await onSubmit(submitData);
      console.log('onSubmit completed successfully');
    } catch (error: any) {
      console.error('Error submitting cession:', error);
      console.error('Error details:', error.message, error.stack);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <CessionBasicInfoSection 
        formData={formData}
        errors={errors}
        validationErrorMessage={validationErrorMessage}
        onFieldChange={handleChange}
        onClearValidationError={clearValidationError}
      />

      <CessionFormActions 
        cession={cession}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};
