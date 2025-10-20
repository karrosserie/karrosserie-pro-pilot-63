
import React, { useState } from 'react';
import Joyride from 'react-joyride';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useFleetLoanForm } from '@/hooks/use-fleet-loan-form';
import { useFleetLoanFormValidation } from './form/FleetLoanFormValidation';
import { useTabValidation } from '@/hooks/fleet-loan-form/use-tab-validation';
import FleetLoanFormNavigation from './form/FleetLoanFormNavigation';
import DamageAssessmentTab from './form/DamageAssessmentTab';
import VehicleDetailsTab from './form/VehicleDetailsTab';
import ClientInfoTab from './form/ClientInfoTab';
import InsuranceTab from './form/InsuranceTab';
import AttestationTab from './form/AttestationTab';
import ClientDialog from '@/components/client/ClientDialog';
import { useClients } from '@/hooks/use-clients';
import { useLoanFormGuide } from '@/hooks/use-loan-form-guide';

interface FleetLoanFormProps {
  vehicle: FleetVehicle;
  onSubmit: (loanData: LoanFormData) => void;
  onCancel: () => void;
  defaultValues?: any;
  isViewMode?: boolean;
  isOpen?: boolean;
}

export interface LoanFormData {
  vehicleId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  startDate: string;
  expectedReturnDate: string;
  notes?: string;
  mileage: number;
  fuelLevel: number;
  vehicleImages: string[];
  damages: DamageItem[];
  driverLicenseFrontUrl: string;
  driverLicenseBackUrl: string;
  // New license fields
  licenseNumber?: string;
  licenseIssueDate?: string;
  prefecture?: string;
  holderInfo?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  // Insurance fields
  clientInsurance?: boolean;
  insuranceCompanyName?: string;
  insurancePhone?: string;
  insuranceEmail?: string;
  insuranceContractNumber?: string;
  insuranceAddress?: string;
  insuranceCity?: string;
  insurancePostalCode?: string;
  // Attestation fields
  attestationAccepted?: boolean;
  clientSignature?: string;
}

export interface DamageItem {
  id: string;
  name: string;
  type: 'none' | 'rayure' | 'choc' | 'hs';
}

const FleetLoanForm: React.FC<FleetLoanFormProps> = ({
  vehicle,
  onSubmit,
  onCancel,
  defaultValues,
  isViewMode = false,
  isOpen = false
}) => {
  // État pour le dialog de création de client
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  
  // Hook pour gérer les clients
  const { createClient } = useClients();

  const {
    activeTab,
    setActiveTab,
    formData,
    createReservation,
    handleInputChange,
    handleClientSelect,
    handleFreeTextClientChange,
    handleMileageChange,
    handleFuelLevelChange,
    handleImageAdd,
    handleImageRemove,
    handleImageUpdate,
    handleDamageUpdate,
    handleDriverLicenseFrontUpload,
    handleDriverLicenseBackUpload,
    handleLicenseAnalyzed,
    handleInsuranceSwitchChange,
    handleInsurancePhoneChange,
    handleSignatureChange,
    handleSubmit
  } = useFleetLoanForm(vehicle, onSubmit, defaultValues);

  const { isFormValid } = useFleetLoanFormValidation(formData);
  const { validateTabByValue } = useTabValidation();
  
  const { runTour, stepIndex, steps, handleJoyrideCallback } = useLoanFormGuide(
    isViewMode, 
    isOpen,
    formData.driverLicenseFrontUrl,
    formData.driverLicenseBackUrl,
    setActiveTab,
    activeTab
  );

  const tabs = [
    { value: 'client-info', label: 'Informations sur le client' },
    { value: 'insurance', label: 'Assurance' },
    { value: 'damages', label: 'Chocs & rayures' },
    { value: 'vehicle-details', label: 'Détails du véhicule & photos' },
    { value: 'attestation', label: 'Attestation & Signature' }
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.value === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handleNext = () => {
    if (!isLastTab) {
      // Valider l'onglet actuel avant de passer au suivant
      const currentTab = tabs[currentTabIndex];
      if (!validateTabByValue(currentTab.value, formData)) {
        return; // Arrêter si la validation échoue
      }
      
      const nextTab = tabs[currentTabIndex + 1];
      setActiveTab(nextTab.value);
    }
  };

  const handlePrevious = () => {
    if (!isFirstTab) {
      const prevTab = tabs[currentTabIndex - 1];
      setActiveTab(prevTab.value);
    }
  };

  // Handler pour ouvrir le dialog de création de client
  const handleNewClientClick = () => {
    setIsClientDialogOpen(true);
  };

  // Handler pour la soumission du nouveau client
  const handleNewClientSubmit = (clientData: any) => {
    console.log('Nouveau client créé (soumission):', clientData);
    
    // Vérifier que les champs requis sont remplis
    if (!clientData.firstName?.trim() || !clientData.lastName?.trim()) {
      console.error('Les champs prénom et nom sont obligatoires');
      return;
    }

    // Envoyer les données au hook (il se charge du mapping et de company_id)
    createClient.mutate({
      ...clientData,
      firstName: clientData.firstName.trim(),
      lastName: clientData.lastName.trim(),
    });

    setIsClientDialogOpen(false);
  };

  // Get vehicle display name - support both old and new structure
  const getVehicleDisplayName = () => {
    if (vehicle.car_brands?.name && vehicle.car_models?.name) {
      return `${vehicle.car_brands.name} ${vehicle.car_models.name}`;
    }
    return 'Véhicule';
  };

  return (
    <div className="flex flex-col h-full">
      <Joyride
        steps={steps}
        run={runTour}
        stepIndex={stepIndex}
        continuous
        showProgress
        showSkipButton
        spotlightClicks
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: 'hsl(var(--primary))',
          },
        }}
        locale={{
          back: 'Précédent',
          close: 'Fermer',
          last: 'Terminer',
          next: 'Suivant',
          skip: 'Passer le guide',
        }}
      />
      
      <div className="px-4 pb-2 shrink-0">
        <h3 className="text-base md:text-lg font-medium text-gray-900">
          {getVehicleDisplayName()} ({vehicle.license_plate})
        </h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
        <div className="px-4 shrink-0 border-b">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-[10px] md:text-sm px-1 md:px-3 py-1.5 md:py-2">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="client-info" className="flex-1 overflow-y-auto px-3 md:px-4 py-4 mt-0" style={{ paddingBottom: '120px' }}>
          <ClientInfoTab
            formData={formData}
            onInputChange={handleInputChange}
            onClientSelect={handleClientSelect}
            onFreeTextClientChange={handleFreeTextClientChange}
            onDriverLicenseFrontUpload={handleDriverLicenseFrontUpload}
            onDriverLicenseBackUpload={handleDriverLicenseBackUpload}
            onLicenseAnalyzed={handleLicenseAnalyzed}
            isViewMode={isViewMode}
            onNewClientClick={handleNewClientClick}
          />
        </TabsContent>

        <TabsContent value="insurance" className="flex-1 overflow-y-auto px-3 md:px-4 py-4 mt-0" style={{ paddingBottom: '120px' }}>
          <InsuranceTab
            formData={formData}
            onInputChange={handleInputChange}
            onSwitchChange={handleInsuranceSwitchChange}
            onPhoneChange={handleInsurancePhoneChange}
            isViewMode={isViewMode}
          />
        </TabsContent>

        <TabsContent value="damages" className="flex-1 overflow-y-auto px-3 md:px-4 py-4 mt-0" style={{ paddingBottom: '120px' }}>
          <DamageAssessmentTab
            damages={formData.damages}
            onDamageUpdate={handleDamageUpdate}
            isViewMode={isViewMode}
          />
        </TabsContent>

        <TabsContent value="vehicle-details" className="flex-1 overflow-y-auto px-3 md:px-4 py-4 mt-0" style={{ paddingBottom: '120px' }}>
          <VehicleDetailsTab
            vehicleId={vehicle.id}
            mileage={formData.mileage}
            fuelLevel={formData.fuelLevel}
            vehicleImages={formData.vehicleImages.map((img: any) => 
              typeof img === 'string' ? { url: img, timing: 'Avant' as const } : img
            )}
            onMileageChange={handleMileageChange}
            onFuelLevelChange={handleFuelLevelChange}
            onImageAdd={handleImageAdd}
            onImageRemove={handleImageRemove}
            onImageUpdate={handleImageUpdate}
            onImageTimingUpdate={(index, timing) => {
              // Stub pour le moment - peut être implémenté plus tard
              console.log('Timing update:', index, timing);
            }}
            isViewMode={isViewMode}
            showTimingSelector={false}
          />
        </TabsContent>

        <TabsContent value="attestation" className="flex-1 overflow-y-auto px-3 md:px-4 py-4 mt-0" style={{ paddingBottom: '120px' }}>
          <AttestationTab
            formData={formData}
            vehicle={vehicle}
            onInputChange={handleInputChange}
            onSignatureChange={handleSignatureChange}
            isViewMode={isViewMode}
          />
        </TabsContent>
      </Tabs>

      <div className="px-4 pb-4 pt-2 shrink-0 border-t bg-background">
      <FleetLoanFormNavigation
        activeTab={activeTab}
        onCancel={onCancel}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isFormValid={Boolean(isFormValid())}
        isPending={createReservation.isPending}
        isFirstTab={isFirstTab}
        isLastTab={isLastTab}
        isViewMode={isViewMode}
      />
      </div>

      {/* Dialog pour créer un nouveau client */}
      <ClientDialog
        open={isClientDialogOpen}
        onOpenChange={setIsClientDialogOpen}
        title="Nouveau client"
        description="Créer un nouveau client"
        onSubmit={handleNewClientSubmit}
        mode="create"
      />
    </div>
  );
};

export default FleetLoanForm;
