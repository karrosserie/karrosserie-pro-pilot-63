
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/use-clients';
import { useVehicles } from '@/hooks/use-vehicles';
import { Cession } from '@/services/supabase/cessions';
import { CessionBasicInfoSection } from './form/CessionBasicInfoSection';
import { CessionAssignmentSection } from './form/CessionAssignmentSection';
import { CessionDetailsSection } from './form/CessionDetailsSection';
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
  const { clients, isLoading: isLoadingClients } = useClients();
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles();
  
  const {
    formData,
    errors,
    isReadOnly,
    handleChange,
    validateForm,
    prepareSubmitData
  } = useCessionFormLogic({ cession });

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
      console.error('Error submitting cession:', error);
    }
  };

  const clientOptions = Array.isArray(clients) ? clients.filter(client => client && client.id) : [];
  const vehicleOptions = Array.isArray(vehicles) ? vehicles.filter(vehicle => vehicle && vehicle.id) : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <CessionBasicInfoSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
      />

      <CessionAssignmentSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
        clientOptions={clientOptions}
        vehicleOptions={vehicleOptions}
        isLoadingClients={isLoadingClients}
        isLoadingVehicles={isLoadingVehicles}
      />

      <CessionDetailsSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
        isReadOnly={isReadOnly}
      />

      <CessionFormActions 
        cession={cession}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};
