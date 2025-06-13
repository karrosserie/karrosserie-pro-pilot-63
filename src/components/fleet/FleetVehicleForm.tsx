
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { useFleetVehicleForm } from '@/hooks/use-fleet-vehicle-form';
import { useFleetVehicleFormValidation } from '@/hooks/use-fleet-vehicle-form-validation';
import { useFleetVehicleVinHandler } from '@/hooks/use-fleet-vehicle-vin-handler';
import { useFleetVehicleDocuments } from '@/hooks/use-fleet-vehicle-documents';
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
  const { createVehicle, updateVehicle } = useFleetVehicles();
  const { user } = useAuth();
  const isViewMode = mode === 'view';
  const [activeTab, setActiveTab] = useState('vehicle-info');

  const { formData, setFormData, handleInputChange, handleSelectChange } = useFleetVehicleForm(vehicle);
  const { isFormValid, showValidationError } = useFleetVehicleFormValidation();
  const { handleVinInputChange } = useFleetVehicleVinHandler({ formData, setFormData });
  const {
    documentsData,
    handleRegistrationFrontUpload,
    handleRegistrationBackUpload,
    handleInsuranceCardUpload
  } = useFleetVehicleDocuments(vehicle);

  const handleBrandSelectChange = (brandId: string) => {
    console.log('Manual brand selection:', brandId);
    setFormData(prev => ({ 
      ...prev, 
      brand_id: brandId,
      model_id: '' // Reset model when brand changes
    }));
  };

  const handleModelSelectChange = (modelId: string) => {
    console.log('Manual model selection:', modelId);
    setFormData(prev => ({ ...prev, model_id: modelId }));
  };

  const handleNext = () => {
    if (activeTab === 'vehicle-info') {
      setActiveTab('documents');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const validationData = { formData, documentsData };
    if (!isFormValid(validationData)) {
      showValidationError();
      return;
    }
    
    try {
      const submissionData = {
        vin: formData.vin,
        engine_number: formData.engine_number,
        year: formData.year,
        license_plate: formData.license_plate,
        color: formData.color,
        status: formData.status,
        registration_front_url: documentsData.registrationFrontUrl,
        registration_back_url: documentsData.registrationBackUrl,
        insurance_card_url: documentsData.insuranceCardUrl,
        brand_id: formData.brand_id,
        model_id: formData.model_id,
        brand: '',
        model: ''
      };

      if (mode === 'edit' && vehicle) {
        await updateVehicle.mutateAsync({
          id: vehicle.id,
          data: submissionData
        });
      } else if (mode === 'create') {
        await createVehicle.mutateAsync({
          ...submissionData,
          user_id: user.id
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving fleet vehicle:', error);
    }
  };

  const validationData = { formData, documentsData };
  const formValid = isFormValid(validationData);
  const isPending = createVehicle.isPending || updateVehicle.isPending;

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
              onInputChange={handleVinInputChange}
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
