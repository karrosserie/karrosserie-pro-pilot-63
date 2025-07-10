
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/use-clients';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { RepairOrderBasicInfoSection } from './form/RepairOrderBasicInfoSection';
import { RepairOrderAssignmentSection } from './form/RepairOrderAssignmentSection';
import { RepairOrderRepairsSection } from './form/RepairOrderRepairsSection';
import { RepairOrderPartsSection } from './form/RepairOrderPartsSection';
import { RepairOrderDiscountsSection } from './form/RepairOrderDiscountsSection';

import { RepairOrderDetailsSection } from './form/RepairOrderDetailsSection';
import { RepairOrderFormActions } from './form/RepairOrderFormActions';
import { useRepairOrderFormLogic } from './form/useRepairOrderFormLogic';

interface RepairOrderFormProps {
  order?: RepairOrder | null;
  onSubmit: (formData: Partial<RepairOrder>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const RepairOrderForm = ({
  order,
  onSubmit,
  onCancel,
  isSubmitting
}: RepairOrderFormProps) => {
  const { toast } = useToast();
  const { clients, isLoading: isLoadingClients } = useClients();
  
  const {
    formData,
    claimNumber,
    repairs,
    parts,
    discounts,
    errors,
    isReadOnly,
    setRepairs,
    setParts,
    setDiscounts,
    handleChange,
    handleClaimNumberChange,
    validateForm,
    calculateGlobalTotals,
    prepareSubmitData
  } = useRepairOrderFormLogic({ order });

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
      const submitData = prepareSubmitData();
      
      await onSubmit(submitData);
    } catch (error: any) {
      console.error('Error submitting repair order:', error);
    }
  };

  const clientOptions = clients?.filter(client => !!client) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <RepairOrderBasicInfoSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
        claimNumber={claimNumber}
        onClaimNumberChange={handleClaimNumberChange}
      />

      <RepairOrderAssignmentSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
        clientOptions={clientOptions}
        isLoadingClients={isLoadingClients}
      />

      <RepairOrderRepairsSection
        repairs={repairs}
        onRepairsChange={setRepairs}
        isReadOnly={isReadOnly}
      />

      <RepairOrderPartsSection
        parts={parts}
        onPartsChange={setParts}
        isReadOnly={isReadOnly}
      />

      <RepairOrderDiscountsSection
        discounts={discounts}
        onDiscountsChange={setDiscounts}
        isReadOnly={isReadOnly}
      />

      <RepairOrderDetailsSection 
        onFieldChange={handleChange}
        globalTotals={globalTotals}
        notes={formData.notes || ''}
        isReadOnly={isReadOnly}
      />

      <RepairOrderFormActions 
        order={order}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};
