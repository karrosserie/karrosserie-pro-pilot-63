import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useVehicleReservations } from '@/hooks/use-fleet-reservations';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { useFleetVehicleForm } from '@/hooks/use-fleet-vehicle-form';
import { useVinDecoder } from '@/hooks/use-vin-decoder';
import FleetVehicleBasicInfo from './form/FleetVehicleBasicInfo';
import FleetVehicleDetails from './form/FleetVehicleDetails';
import FleetLoansHistoryTab from './form/FleetLoansHistoryTab';
import DocumentsTab from './form/DocumentsTab';

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
  const { reservations } = useVehicleReservations(vehicle?.id);
  const { user } = useAuth();
  const isViewMode = mode === 'view';

  const { formData, setFormData, handleInputChange, handleSelectChange } = useFleetVehicleForm(vehicle);
  
  const {
    selectedBrandId,
    carModels,
    handleVinChange,
    handleBrandChange,
    handleModelChange
  } = useVinDecoder(formData, setFormData);

  const [documentsData, setDocumentsData] = useState({
    registrationFrontUrl: '',
    registrationBackUrl: '',
    insuranceCardUrl: ''
  });

  const handleVinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'vin') {
      const updatedFormData = handleVinChange(value, formData);
      console.log(updatedFormData);
      setFormData(updatedFormData);
    } else {
      handleInputChange(e);
    }
  };

  const handleBrandSelectChange = (brandId: string) => {
    const updatedFormData = handleBrandChange(brandId, formData);
    setFormData(updatedFormData);
  };

  const handleModelSelectChange = (modelName: string) => {
    const updatedFormData = handleModelChange(modelName, formData);
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    
    try {
      const submissionData = {
        vin: formData.vin,
        engine_number: formData.engine_number,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        license_plate: formData.license_plate,
        color: formData.color,
        status: formData.status
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

  const handleRegistrationFrontUpload = (url: string) => {
    setDocumentsData(prev => ({ ...prev, registrationFrontUrl: url }));
  };

  const handleRegistrationBackUpload = (url: string) => {
    setDocumentsData(prev => ({ ...prev, registrationBackUrl: url }));
  };

  const handleInsuranceCardUpload = (url: string) => {
    setDocumentsData(prev => ({ ...prev, insuranceCardUrl: url }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="vehicle-info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vehicle-info">Informations sur le véhicule</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="loans-history">Historique des prêts</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicle-info" className="space-y-6 mt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FleetVehicleBasicInfo
              formData={{
                vin: formData.vin,
                engine_number: formData.engine_number,
                brand: formData.brand,
                model: formData.model,
                status: formData.status
              }}
              selectedBrandId={selectedBrandId}
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

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                {isViewMode ? "Fermer" : "Annuler"}
              </Button>
              {!isViewMode && (
                <Button 
                  type="submit" 
                  className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
                  disabled={createVehicle.isPending || updateVehicle.isPending}
                >
                  {createVehicle.isPending || updateVehicle.isPending 
                    ? "Enregistrement..." 
                    : (mode === 'edit' ? "Mettre à jour" : "Enregistrer")
                  }
                </Button>
              )}
            </div>
          </form>
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
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isViewMode={isViewMode}
          />
        </TabsContent>

        <TabsContent value="loans-history" className="space-y-6 mt-6">
          <FleetLoansHistoryTab reservations={reservations} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FleetVehicleForm;
