
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useFleetVehicleForm } from '@/hooks/use-fleet-vehicle-form';
import { useFleetVehicleFormValidation } from '@/hooks/use-fleet-vehicle-form-validation';
import { useFleetVehicleVinHandler } from '@/hooks/use-fleet-vehicle-vin-handler';
import { useFleetVehicleDocuments } from '@/hooks/use-fleet-vehicle-documents';
import { useFleetVehicleFormHandlers } from '@/hooks/use-fleet-vehicle-form-handlers';
import { useFleetVehicleFormNavigation } from '@/hooks/use-fleet-vehicle-form-navigation';
import FleetVehicleBasicInfo from './form/FleetVehicleBasicInfo';
import FleetVehicleDetails from './form/FleetVehicleDetails';
import DocumentsTab from './form/DocumentsTab';
import FleetVehicleFormNavigation from './form/FleetVehicleFormNavigation';

interface FleetVehicleFormProps {
  vehicle?: FleetVehicle | null;
  mode: 'create' | 'edit' | 'view';
  onSuccess: () => void;
  onCancel: () => void;
}

const FleetVehicleForm: React.FC<FleetVehicleFormProps> = ({
  vehicle,
  mode,
  onSuccess,
  onCancel
}) => {
  const isViewMode = mode === 'view';
  const { activeTab, setActiveTab, handleNext } = useFleetVehicleFormNavigation();

  const { formData, setFormData, handleInputChange, handleSelectChange } = useFleetVehicleForm(vehicle);
  const { isFormValid, showValidationError } = useFleetVehicleFormValidation();
  const { handleVinInputChange } = useFleetVehicleVinHandler({ formData, setFormData });
  const {
    documentsData,
    handleRegistrationFrontUpload,
    handleRegistrationBackUpload,
    handleInsuranceCardUpload
  } = useFleetVehicleDocuments(vehicle);

  const {
    handleBrandSelectChange,
    handleModelSelectChange,
    handleSubmit,
    isPending
  } = useFleetVehicleFormHandlers({
    formData,
    setFormData,
    documentsData,
    vehicle,
    mode,
    onSuccess,
    isFormValid,
    showValidationError
  });

  const validationData = { formData, documentsData };
  const formValid = isFormValid(validationData);

  // Combined input handler that handles both VIN processing and regular input changes
  const handleCombinedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('FleetVehicleForm - Combined input change:', e.target.name, e.target.value);
    
    if (e.target.name === 'vin') {
      handleVinInputChange(e);
    } else {
      handleInputChange(e);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vehicle-info">Informations sur le véhicule</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicle-info" className="space-y-6 mt-6">
            <FleetVehicleBasicInfo
              formData={{
                vin: formData.vin,
                engine_number: formData.engine_number,
                brand_id: formData.brand_id,
                model_id: formData.model_id,
                status: formData.status
              }}
              isViewMode={isViewMode}
              onInputChange={handleCombinedInputChange}
              onBrandChange={handleBrandSelectChange}
              onModelChange={handleModelSelectChange}
              onSelectChange={handleSelectChange}
            />

            <FleetVehicleDetails
              formData={{
                year: formData.year,
                license_plate: formData.license_plate,
                color: formData.color
              }}
              isViewMode={isViewMode}
              onInputChange={handleInputChange}
            />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6 mt-6">
            <DocumentsTab
              vehicleId={vehicle?.id || 'new'}
              registrationFrontUrl={documentsData.registrationFrontUrl}
              registrationBackUrl={documentsData.registrationBackUrl}
              insuranceCardUrl={documentsData.insuranceCardUrl}
              onRegistrationFrontUpload={handleRegistrationFrontUpload}
              onRegistrationBackUpload={handleRegistrationBackUpload}
              onInsuranceCardUpload={handleInsuranceCardUpload}
              isViewMode={isViewMode}
            />
          </TabsContent>
        </Tabs>

        <FleetVehicleFormNavigation
          activeTab={activeTab}
          isViewMode={isViewMode}
          isFormValid={formValid}
          isPending={isPending}
          mode={mode}
          onCancel={onCancel}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
};

export default FleetVehicleForm;
