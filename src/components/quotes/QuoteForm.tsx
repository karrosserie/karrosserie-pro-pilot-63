
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/use-clients';
import { Quote } from '@/services/supabase/quotes';
import { QuoteBasicInfoSection } from './form/QuoteBasicInfoSection';
import { QuoteAssignmentSection } from './form/QuoteAssignmentSection';
import { QuoteDetailsSection } from './form/QuoteDetailsSection';
import { QuoteRepairsSection } from './form/QuoteRepairsSection';
import { QuotePartsSection } from './form/QuotePartsSection';
import { QuoteDiscountsSection } from './form/QuoteDiscountsSection';
import { QuoteFormActions } from './form/QuoteFormActions';
import { useQuoteFormLogic } from './form/useQuoteFormLogic';

interface QuoteFormProps {
  quote?: Quote | null;
  onSubmit: (formData: Partial<Quote>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const QuoteForm = ({
  quote,
  onSubmit,
  onCancel,
  isSubmitting
}: QuoteFormProps) => {
  const { toast } = useToast();
  const { clients, isLoading: isLoadingClients } = useClients();
  
  const {
    formData,
    notes,
    repairs,
    parts,
    discounts,
    errors,
    isReadOnly,
    claimNumber,
    currentMileage,
    setRepairs,
    setParts,
    setDiscounts,
    handleChange,
    handleClaimNumberChange,
    handleCurrentMileageChange,
    validateForm,
    calculateGlobalTotals,
    prepareSubmitData
  } = useQuoteFormLogic({ quote });

  const globalTotals = calculateGlobalTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submissions
    
    console.log('Validation attempt - Current errors before validation:', errors);
    console.log('Form data before validation:', { formData, claimNumber, currentMileage });
    
    const isValid = validateForm();
    
    console.log('Validation result:', isValid);
    console.log('Errors after validation:', errors);
    
    if (!isValid) {
      console.log('Validation failed - showing toast');
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const submitData = {
        ...prepareSubmitData(),
        amount: globalTotals.total
      };
      
      await onSubmit(submitData);
    } catch (error: any) {
      console.error('Error submitting quote:', error);
      // Don't show toast here as it might be already handled in the parent
    }
  };

  // Forcer une erreur pour le test si le client n'est pas sélectionné
  React.useEffect(() => {
    console.log('Current errors state:', errors);
    console.log('Current form data:', formData);
  }, [errors, formData]);

  const clientOptions = clients?.filter(client => !!client) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <QuoteBasicInfoSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
        claimNumber={claimNumber}
        currentMileage={currentMileage}
        onClaimNumberChange={handleClaimNumberChange}
        onCurrentMileageChange={handleCurrentMileageChange}
      />

      <QuoteAssignmentSection 
        formData={formData}
        onFieldChange={handleChange}
        clientOptions={clientOptions}
        isLoadingClients={isLoadingClients}
      />

      <QuoteRepairsSection 
        repairs={repairs}
        onRepairsChange={setRepairs}
        isReadOnly={isReadOnly}
      />

      <QuotePartsSection 
        parts={parts}
        onPartsChange={setParts}
        isReadOnly={isReadOnly}
      />

      <QuoteDiscountsSection 
        discounts={discounts}
        onDiscountsChange={setDiscounts}
        isReadOnly={isReadOnly}
      />

      <QuoteDetailsSection 
        notes={notes}
        onFieldChange={handleChange}
        globalTotals={globalTotals}
        isReadOnly={isReadOnly}
      />

      <QuoteFormActions 
        quote={quote}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};
