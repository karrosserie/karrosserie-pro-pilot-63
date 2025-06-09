
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/use-clients';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceBasicInfoSection } from './form/InvoiceBasicInfoSection';
import { InvoiceAssignmentSection } from './form/InvoiceAssignmentSection';
import { InvoiceRepairsSection } from './form/InvoiceRepairsSection';
import { InvoicePartsSection } from './form/InvoicePartsSection';
import { InvoiceGlobalDiscountsSection } from './form/InvoiceGlobalDiscountsSection';
import { InvoiceDetailsSection } from './form/InvoiceDetailsSection';
import { InvoiceFormActions } from './form/InvoiceFormActions';
import { useInvoiceFormLogic } from './form/useInvoiceFormLogic';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onSubmit: (formData: Partial<Invoice>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const InvoiceForm = ({
  invoice,
  onSubmit,
  onCancel,
  isSubmitting
}: InvoiceFormProps) => {
  const { toast } = useToast();
  const { clients, isLoading: isLoadingClients } = useClients();
  
  const {
    formData,
    description,
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
  } = useInvoiceFormLogic({ invoice });

  const globalTotals = calculateGlobalTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) {
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
      console.error('Error submitting invoice:', error);
    }
  };

  // S'assurer que clientOptions est un tableau valide
  const clientOptions = Array.isArray(clients) ? clients.filter(client => client && client.id) : [];
  
  console.log('InvoiceForm - clients from useClients:', clients);
  console.log('InvoiceForm - clientOptions after filtering:', clientOptions);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <InvoiceBasicInfoSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
        claimNumber={claimNumber}
        currentMileage={currentMileage}
        onClaimNumberChange={handleClaimNumberChange}
        onCurrentMileageChange={handleCurrentMileageChange}
      />

      <InvoiceAssignmentSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
        clientOptions={clientOptions}
        isLoadingClients={isLoadingClients}
      />

      <InvoiceRepairsSection
        repairs={repairs}
        onRepairsChange={setRepairs}
        isReadOnly={isReadOnly}
      />

      <InvoicePartsSection
        parts={parts}
        onPartsChange={setParts}
        isReadOnly={isReadOnly}
      />

      <InvoiceGlobalDiscountsSection
        discounts={discounts}
        onDiscountsChange={setDiscounts}
        isReadOnly={isReadOnly}
      />

      <InvoiceDetailsSection 
        description={description}
        onFieldChange={handleChange}
        globalTotals={globalTotals}
        isReadOnly={isReadOnly}
      />

      <InvoiceFormActions 
        invoice={invoice}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};
