
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/use-clients';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceBasicInfoSection } from './form/InvoiceBasicInfoSection';
import { InvoiceAssignmentSection } from './form/InvoiceAssignmentSection';
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
    errors,
    isReadOnly,
    setRepairs,
    setParts,
    handleChange,
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

  const clientOptions = clients?.filter(client => !!client) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <InvoiceBasicInfoSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
      />

      <InvoiceAssignmentSection 
        formData={formData}
        onFieldChange={handleChange}
        clientOptions={clientOptions}
        isLoadingClients={isLoadingClients}
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
