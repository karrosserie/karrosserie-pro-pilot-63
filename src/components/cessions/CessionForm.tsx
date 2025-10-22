
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Cession } from '@/services/supabase/cessions';
import { CessionBasicInfoSection } from './form/CessionBasicInfoSection';
import { CessionFormActions } from './form/CessionFormActions';
import { useCessionFormLogic } from './form/useCessionFormLogic';
import { CessionModificatifWarning } from './CessionModificatifWarning';

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
  const [showModificatifWarning, setShowModificatifWarning] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<any>(null);
  
  const {
    formData,
    errors,
    isReadOnly,
    validationErrorMessage,
    client,
    repairOrder,
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
      
      // Vérifier si l'ordre de réparation est lié à un devis modifié sans modificatif
      if (repairOrder?.is_modified_from_report && !repairOrder?.modificatif_received_at) {
        setPendingSubmitData(submitData);
        setShowModificatifWarning(true);
        return;
      }
      
      console.log('Calling onSubmit with data:', submitData);
      await onSubmit(submitData);
      console.log('onSubmit completed successfully');
    } catch (error: any) {
      console.error('Error submitting cession:', error);
      console.error('Error details:', error.message, error.stack);
    }
  };

  const handleConfirmWithModificatif = async () => {
    setShowModificatifWarning(false);
    if (pendingSubmitData) {
      await onSubmit(pendingSubmitData);
      setPendingSubmitData(null);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
        <CessionBasicInfoSection 
          formData={formData}
          errors={errors}
          validationErrorMessage={validationErrorMessage}
          client={client}
          companyId={undefined}
          onFieldChange={handleChange}
          onClearValidationError={clearValidationError}
        />

        <CessionFormActions 
          cession={cession}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </form>

      <CessionModificatifWarning
        open={showModificatifWarning}
        onOpenChange={setShowModificatifWarning}
        onConfirm={handleConfirmWithModificatif}
      />
    </>
  );
};
