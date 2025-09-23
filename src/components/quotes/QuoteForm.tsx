
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/use-clients';
import { useVehicles } from '@/hooks/use-vehicles';
import { Quote } from '@/services/supabase/quotes';
import VehicleDialog from '@/components/vehicle/VehicleDialog';
import ClientDialog from '@/components/client/ClientDialog';
import { QuoteBasicInfoSection } from './form/QuoteBasicInfoSection';
import { QuoteAssignmentSection } from './form/QuoteAssignmentSection';
import { QuoteDetailsSection } from './form/QuoteDetailsSection';
import { QuoteRepairsAndPartsSection } from './form/QuoteRepairsAndPartsSection';
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
  const { clients, isLoading: isLoadingClients, createClient } = useClients();
  const { createVehicle } = useVehicles();
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  
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

  const handleNewClientClick = () => {
    setIsClientDialogOpen(true);
  };

  const handleNewClientSubmit = async (clientData: any) => {
    try {
      const newClient = await createClient.mutateAsync(clientData);
      if (newClient) {
        // Sélectionner automatiquement le client créé
        handleChange('client_id', newClient.id);
        // Réinitialiser le véhicule
        handleChange('vehicle_id', '');
      }
      setIsClientDialogOpen(false);
      toast({
        title: "Client créé",
        description: "Le client a été créé et sélectionné automatiquement."
      });
    } catch (error: any) {
      console.error('Error creating client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le client.",
        variant: "destructive"
      });
    }
  };

  const handleNewVehicleClick = () => {
    setIsVehicleDialogOpen(true);
  };

  const handleNewVehicleSubmit = async (vehicleData: any) => {
    try {
      // Ajouter le client_id au véhicule
      const vehicleWithClient = {
        ...vehicleData,
        client_id: formData.client_id
      };
      
      const newVehicle = await createVehicle.mutateAsync(vehicleWithClient);
      if (newVehicle) {
        // Sélectionner automatiquement le véhicule créé
        handleChange('vehicle_id', newVehicle.id);
      }
      setIsVehicleDialogOpen(false);
      toast({
        title: "Véhicule créé",
        description: "Le véhicule a été créé et sélectionné automatiquement."
      });
    } catch (error: any) {
      console.error('Error creating vehicle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le véhicule.",
        variant: "destructive"
      });
    }
  };

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
        onNewClientClick={handleNewClientClick}
        onNewVehicleClick={handleNewVehicleClick}
      />

      <QuoteRepairsAndPartsSection 
        repairs={repairs}
        parts={parts}
        onRepairsChange={setRepairs}
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

      <ClientDialog
        open={isClientDialogOpen}
        onOpenChange={setIsClientDialogOpen}
        title="Nouveau client"
        description="Créer un nouveau client pour ce devis"
        onSubmit={handleNewClientSubmit}
        mode="create"
      />

      <VehicleDialog
        open={isVehicleDialogOpen}
        onOpenChange={setIsVehicleDialogOpen}
        title="Nouveau véhicule"
        description="Créer un nouveau véhicule pour ce client"
        onSubmit={handleNewVehicleSubmit}
        mode="create"
      />
    </form>
  );
};
