
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useFleetLoanForm } from '@/hooks/use-fleet-loan-form';
import { useFleetLoanFormValidation } from './form/FleetLoanFormValidation';
import FleetReturnFormNavigation from './form/FleetReturnFormNavigation';
import DamageAssessmentTab from './form/DamageAssessmentTab';
import VehicleDetailsTab from './form/VehicleDetailsTab';
import AttestationTab from './form/AttestationTab';
import { LoanFormData, DamageItem } from './FleetLoanForm';

interface FleetReturnFormProps {
  vehicle: FleetVehicle;
  onSubmit: (loanData: LoanFormData) => void;
  onCancel: () => void;
  defaultValues?: any;
}

const FleetReturnForm: React.FC<FleetReturnFormProps> = ({
  vehicle,
  onSubmit,
  onCancel,
  defaultValues
}) => {
  const {
    activeTab,
    setActiveTab,
    formData,
    createReservation,
    handleInputChange,
    handleClientSelect,
    handleMileageChange,
    handleFuelLevelChange,
    handleImageAdd,
    handleImageRemove,
    handleImageUpdate,
    handleDamageUpdate,
    handleDriverLicenseFrontUpload,
    handleDriverLicenseBackUpload,
    handleInsuranceSwitchChange,
    handleInsurancePhoneChange,
    handleSignatureChange,
    handleSubmit
  } = useFleetLoanForm(vehicle, onSubmit, defaultValues);

  const { isFormValid } = useFleetLoanFormValidation(formData);

  const tabs = [
    { value: 'damages', label: 'Chocs & rayures' },
    { value: 'vehicle-details', label: 'Détails du véhicule & photos' },
    { value: 'attestation', label: 'Attestation & Signature' }
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.value === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handleNext = () => {
    if (!isLastTab) {
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

  React.useEffect(() => {
    // Set initial active tab to damages for return form
    setActiveTab('damages');
  }, [setActiveTab]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Retour du véhicule: {vehicle.brand} {vehicle.model} ({vehicle.license_plate})
        </h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="damages" className="space-y-6">
          <DamageAssessmentTab
            damages={formData.damages}
            onDamageUpdate={handleDamageUpdate}
          />
        </TabsContent>

        <TabsContent value="vehicle-details" className="space-y-6">
          <VehicleDetailsTab
            vehicleId={vehicle.id}
            mileage={formData.mileage}
            fuelLevel={formData.fuelLevel}
            vehicleImages={formData.vehicleImages}
            onMileageChange={handleMileageChange}
            onFuelLevelChange={handleFuelLevelChange}
            onImageAdd={handleImageAdd}
            onImageRemove={handleImageRemove}
            onImageUpdate={handleImageUpdate}
          />
        </TabsContent>

        <TabsContent value="attestation" className="space-y-6">
          <AttestationTab
            formData={formData}
            vehicle={vehicle}
            onInputChange={handleInputChange}
            onSignatureChange={handleSignatureChange}
          />
        </TabsContent>
      </Tabs>

      <FleetReturnFormNavigation
        activeTab={activeTab}
        onCancel={onCancel}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isFormValid={Boolean(isFormValid())}
        isPending={createReservation.isPending}
        isFirstTab={isFirstTab}
        isLastTab={isLastTab}
      />
    </div>
  );
};

export default FleetReturnForm;
