
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
  prefillData?: any;
  isConversionFromReport?: boolean;
}

export const QuoteForm = ({
  quote,
  onSubmit,
  onCancel,
  isSubmitting,
  prefillData,
  isConversionFromReport
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
    setRepairs,
    setParts,
    setDiscounts,
    handleChange,
    handleClaimNumberChange,
    validateForm,
    calculateGlobalTotals,
    prepareSubmitData
  } = useQuoteFormLogic({ quote, prefillData });

  const globalTotals = calculateGlobalTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submissions
    
    console.log('Validation attempt - Current errors before validation:', errors);
    console.log('Form data before validation:', { formData, claimNumber });
    
    const validationResult = validateForm();
    
    console.log('Validation result:', validationResult.isValid);
    console.log('Errors from validation:', validationResult.errors);
    
    if (!validationResult.isValid) {
      console.log('Validation failed - showing toast');
      console.log('About to pass errors to components:', validationResult.errors);
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
      
      console.log('🔄 QuoteForm - About to submit quote with data:', JSON.stringify(submitData, null, 2));
      console.log('🔄 QuoteForm - client_id type and value:', typeof submitData.client_id, submitData.client_id);
      console.log('🔄 QuoteForm - vehicle_id type and value:', typeof submitData.vehicle_id, submitData.vehicle_id);
      
      await onSubmit(submitData);
    } catch (error: any) {
      console.error('❌ QuoteForm - Error submitting quote:', error);
      // Don't show toast here as it might be already handled in the parent
    }
  };

  const clientOptions = clients?.filter(client => !!client) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <QuoteBasicInfoSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
        claimNumber={claimNumber}
        onClaimNumberChange={handleClaimNumberChange}
      />

      <QuoteAssignmentSection 
        formData={formData}
        onChange={handleChange}
        clientOptions={clientOptions}
        isLoadingClients={isLoadingClients}
        errors={errors}
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
        isConversionFromReport={isConversionFromReport}
      />
    </form>
  );
};
