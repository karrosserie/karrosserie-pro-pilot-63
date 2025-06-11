
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useFleetReturnForm } from '@/hooks/use-fleet-return-form';
import FleetReturnFormNavigation from './form/FleetReturnFormNavigation';
import ReturnDamageAssessmentTab from './form/ReturnDamageAssessmentTab';
import VehicleDetailsTab from './form/VehicleDetailsTab';
import ReturnAttestationTab from './form/ReturnAttestationTab';
import { FleetReturnFormData } from './FleetReturnForm.types';

interface FleetReturnFormProps {
  vehicle: FleetVehicle;
  reservationId: string;
  onSubmit: (returnData: FleetReturnFormData) => void;
  onCancel: () => void;
}

const FleetReturnForm: React.FC<FleetReturnFormProps> = ({
  vehicle,
  reservationId,
  onSubmit,
  onCancel
}) => {
  const {
    activeTab,
    setActiveTab,
    formData,
    createReturn,
    handleInputChange,
    handleClientSelect,
    handleMileageChange,
    handleFuelLevelChange,
    handleImageAdd,
    handleImageRemove,
    handleImageUpdate,
    handleDamageUpdate,
    handleSignatureChange,
    handleSubmit
  } = useFleetReturnForm(vehicle, onSubmit, reservationId);

  // Simple validation for return form
  const isFormValid = () => {
    return formData.clientId && 
           formData.returnMileage >= 0 && 
           formData.fuelLevelReturn >= 0 && 
           formData.attestationAccepted && 
           formData.clientSignature && 
           formData.clientName;
  };

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
          <ReturnDamageAssessmentTab
            damages={formData.damages}
            onDamageUpdate={handleDamageUpdate}
          />
        </TabsContent>

        <TabsContent value="vehicle-details" className="space-y-6">
          <VehicleDetailsTab
            vehicleId={vehicle.id}
            mileage={formData.returnMileage}
            fuelLevel={formData.fuelLevelReturn}
            vehicleImages={formData.vehicleImages}
            onMileageChange={handleMileageChange}
            onFuelLevelChange={handleFuelLevelChange}
            onImageAdd={handleImageAdd}
            onImageRemove={handleImageRemove}
            onImageUpdate={handleImageUpdate}
          />
        </TabsContent>

        <TabsContent value="attestation" className="space-y-6">
          <ReturnAttestationTab
            formData={{
              clientId: formData.clientId,
              clientName: formData.clientName,
              returnDate: formData.returnDate,
              attestationAccepted: formData.attestationAccepted,
              clientSignature: formData.clientSignature
            }}
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
        isPending={createReturn.isPending}
        isFirstTab={isFirstTab}
        isLastTab={isLastTab}
      />
    </div>
  );
};

export default FleetReturnForm;
