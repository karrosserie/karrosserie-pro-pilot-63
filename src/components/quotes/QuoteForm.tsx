
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
  const { clients, isLoading: isLoadingClients, createClient, updateClient } = useClients();
  const { createVehicle } = useVehicles();
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
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
    
    if (!validateForm()) {
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
      
      const isEditing = quote && quote.id;
      const hasReportId = quote?.report_id || submitData.report_id;
      const alreadyMarkedAsModified = quote?.is_modified_from_report;
      
      if (isEditing && hasReportId && !alreadyMarkedAsModified) {
        setPendingSubmitData(submitData);
        setShowModificatifAlert(true);
        return;
      }
      
      await onSubmit(submitData);
    } catch (error: any) {
      // Error handled by parent
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

  // Gestion de l'édition du client
  const handleEditClient = (clientId: string) => {
    const client = clientOptions.find(c => c.id === clientId);
    if (client) {
      setEditingClient(client);
      setIsEditClientDialogOpen(true);
    }
  };

  const handleEditClientSubmit = async (clientData: any) => {
    if (editingClient) {
      try {
        await updateClient.mutateAsync({ id: editingClient.id, data: clientData });
        setIsEditClientDialogOpen(false);
        setEditingClient(null);
        toast({
          title: "Client modifié",
          description: "Les informations du client ont été mises à jour."
        });
      } catch (error) {
        console.error('Error updating client:', error);
        toast({
          title: "Erreur",
          description: "Impossible de modifier le client.",
          variant: "destructive"
        });
      }
    }
  };

  const handleNewVehicleSubmit = async (vehicleData: any) => {
    try {
      // Convert camelCase to snake_case for database
      const vehicleWithClient = {
        client_id: formData.client_id,
        vin: vehicleData.vin,
        brand_id: vehicleData.brandId,
        model_id: vehicleData.modelId,
        license_plate: vehicleData.licensePlate,
        engine_number: vehicleData.engineNumber || null,
        year: vehicleData.year ? parseInt(vehicleData.year) : null,
        color: vehicleData.color || null,
        mileage: vehicleData.mileage ? parseInt(vehicleData.mileage) : null,
        insurance_company_id: vehicleData.insuranceCompanyId || null,
        insurance_expiry_date: vehicleData.insuranceExpiryDate || null,
        status: vehicleData.status || 'En attente',
        road_test: vehicleData.roadTest || null,
        road_test_notes: vehicleData.roadTestNotes || null,
        fuel_level: vehicleData.fuelLevel || null,
        pre_accident_defects: vehicleData.preAccidentDefects || null,
        work_items: vehicleData.workItems || null,
        registration_document_front_url: vehicleData.registrationDocumentFrontUrl || null,
        registration_document_back_url: vehicleData.registrationDocumentBackUrl || null,
        vehicle_image_url: vehicleData.vehicleImageUrl || null,
        vehicle_images: vehicleData.vehicleImages || null
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
    <>
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
          onEditClient={handleEditClient}
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
      </form>

      {/* Dialogs moved outside form to prevent nested form submission */}
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
        defaultValues={{
          client_id: formData.client_id
        }}
      />

      <ClientDialog
        open={isEditClientDialogOpen}
        onOpenChange={setIsEditClientDialogOpen}
        title="Modifier le client"
        description="Modifier les informations du client"
        defaultValues={editingClient || undefined}
        onSubmit={handleEditClientSubmit}
        mode="edit"
      />
    </>
  );
};
