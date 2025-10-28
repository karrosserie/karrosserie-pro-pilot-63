
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
import { ModificatifAlert } from './ModificatifAlert';
import { ContactExpertDialog } from './ContactExpertDialog';
import { useQuoteModificatif } from '@/hooks/use-quote-modificatif';

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
  const [showModificatifAlert, setShowModificatifAlert] = useState(false);
  const [showContactExpertDialog, setShowContactExpertDialog] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<any>(null);
  const { requestModificatif } = useQuoteModificatif();
  
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
    
    console.log('=== QUOTE FORM SUBMIT ===');
    console.log('Form data before validation:', formData);
    console.log('Claim number:', claimNumber);
    
    // Valider avant la soumission
    if (!validateForm()) {
      console.log('Validation failed:', errors);
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
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
      
      // Si c'est une modification d'un devis lié à un rapport ET qu'il n'a pas encore été marqué comme modifié
      const isEditing = quote && quote.id;
      const hasReportId = quote?.report_id || submitData.report_id;
      const alreadyMarkedAsModified = quote?.is_modified_from_report;
      
      if (isEditing && hasReportId && !alreadyMarkedAsModified) {
        // Stocker les données pour soumission après confirmation
        setPendingSubmitData(submitData);
        setShowModificatifAlert(true);
        return; // Attendre la décision de l'utilisateur
      }
      
      await onSubmit(submitData);
    } catch (error: any) {
      console.error('❌ QuoteForm - Error submitting quote:', error);
      // Don't show toast here as it might be already handled in the parent
    }
  };

  const handleContinueWithoutModificatif = async () => {
    setShowModificatifAlert(false);
    if (pendingSubmitData) {
      // Soumettre sans marquer comme modifié
      await onSubmit(pendingSubmitData);
      setPendingSubmitData(null);
    }
  };

  const handleRequestModificatif = () => {
    setShowModificatifAlert(false);
    setShowContactExpertDialog(true);
  };

  const handleModificatifRequestSent = async () => {
    if (pendingSubmitData && quote?.id) {
      // Marquer le devis comme modifié et nécessitant un modificatif
      await requestModificatif(quote.id);
      // Soumettre avec le flag is_modified_from_report
      await onSubmit({
        ...pendingSubmitData,
        is_modified_from_report: true
      });
      setPendingSubmitData(null);
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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto px-1">
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

      <ModificatifAlert
        open={showModificatifAlert}
        onOpenChange={setShowModificatifAlert}
        onContinueWithout={handleContinueWithoutModificatif}
        onRequestModificatif={handleRequestModificatif}
      />

      {quote && (
        <ContactExpertDialog
          open={showContactExpertDialog}
          onOpenChange={setShowContactExpertDialog}
          quote={quote}
          onRequestSent={handleModificatifRequestSent}
          modifiedRepairs={repairs}
          modifiedParts={parts}
        />
      )}

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
