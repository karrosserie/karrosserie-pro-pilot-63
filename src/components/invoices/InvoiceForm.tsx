
import React, { useImperativeHandle, forwardRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/use-clients';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceBasicInfoSection } from './form/InvoiceBasicInfoSection';
import { InvoiceAssignmentSection } from './form/InvoiceAssignmentSection';
import { InvoiceRepairsAndPartsSection } from './form/InvoiceRepairsAndPartsSection';
import { InvoiceGlobalDiscountsSection } from './form/InvoiceGlobalDiscountsSection';

import { InvoiceDetailsSection } from './form/InvoiceDetailsSection';
import { InvoiceFormActions } from './form/InvoiceFormActions';
import { useInvoiceFormLogic } from './form/useInvoiceFormLogic';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onSubmit: (formData: Partial<Invoice>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  prefillData?: any;
  isConversionFromRepairOrder?: boolean;
}

export interface InvoiceFormRef {
  releaseReservedNumber: () => Promise<void>;
}

export const InvoiceForm = React.memo(forwardRef<InvoiceFormRef, InvoiceFormProps>(({
  invoice,
  onSubmit,
  onCancel,
  isSubmitting,
  prefillData,
  isConversionFromRepairOrder
}, ref) => {
  const { toast } = useToast();
  const { clients, isLoading: isLoadingClients } = useClients();
  
  const {
    formData,
    repairs,
    parts,
    discounts,
    errors,
    isReadOnly,
    claimNumber,
    skipVehicle,
    setSkipVehicle,
    setRepairs,
    setParts,
    setDiscounts,
    handleChange,
    handleClaimNumberChange,
    validateForm,
    globalTotals,
    prepareSubmitData,
    releaseReservedNumber
  } = useInvoiceFormLogic({ invoice, prefillData });

  // Exposer la fonction releaseReservedNumber au parent via ref
  useImperativeHandle(ref, () => ({
    releaseReservedNumber
  }), [releaseReservedNumber]);

  // Gestion de l'annulation avec libération du numéro réservé
  const handleCancel = async () => {
    await releaseReservedNumber();
    onCancel();
  };

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <InvoiceBasicInfoSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
        claimNumber={claimNumber}
        onClaimNumberChange={handleClaimNumberChange}
        isNewInvoice={!invoice?.id}
      />

      <InvoiceAssignmentSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
        clientOptions={clientOptions}
        isLoadingClients={isLoadingClients}
        skipVehicle={skipVehicle}
        onSkipVehicleChange={setSkipVehicle}
      />

      <InvoiceRepairsAndPartsSection
        repairs={repairs}
        parts={parts}
        onRepairsChange={setRepairs}
        onPartsChange={setParts}
        isReadOnly={isReadOnly}
      />

      <InvoiceGlobalDiscountsSection
        discounts={discounts}
        onDiscountsChange={setDiscounts}
        isReadOnly={isReadOnly}
      />

      <InvoiceDetailsSection 
        onFieldChange={handleChange}
        globalTotals={globalTotals}
        notes={formData.notes || ''}
        isReadOnly={isReadOnly}
        paymentDetails={formData.payment_details || ''}
      />

      <InvoiceFormActions 
        invoice={invoice}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
        isConversionFromRepairOrder={isConversionFromRepairOrder}
      />
    </form>
  );
}));
