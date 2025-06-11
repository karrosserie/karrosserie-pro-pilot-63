
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { useFleetVehicleForm } from '@/hooks/use-fleet-vehicle-form';
import { useVinDecoder } from '@/hooks/use-vin-decoder';
import FleetVehicleBasicInfo from './form/FleetVehicleBasicInfo';
import FleetVehicleDetails from './form/FleetVehicleDetails';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const isViewMode = mode === 'view';
  const [activeTab, setActiveTab] = useState('vehicle-info');

  const { formData, setFormData, handleInputChange, handleSelectChange } = useFleetVehicleForm(vehicle);
  
  const {
    selectedBrandId,
    carModels,
    handleVinChange,
    handleBrandChange,
    handleModelChange
  } = useVinDecoder(formData, setFormData);

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

  const isFormValid = () => {
    const basicInfoValid = formData.vin && formData.brand && formData.model && formData.license_plate;
    return basicInfoValid;
  };

  const handleNext = () => {
    if (activeTab === 'vehicle-info') {
      setActiveTab('vehicle-details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    if (!isFormValid()) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
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

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vehicle-info">Informations sur le véhicule</TabsTrigger>
            <TabsTrigger value="vehicle-details">Détails du véhicule</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicle-info" className="space-y-6 mt-6">
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
          </TabsContent>

          <TabsContent value="vehicle-details" className="space-y-6 mt-6">
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
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            {isViewMode ? "Fermer" : "Annuler"}
          </Button>
          {!isViewMode && (
            <>
              {activeTab === 'vehicle-info' && (
                <Button 
                  type="button" 
                  className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
                  onClick={handleNext}
                >
                  Suivant
                </Button>
              )}
              {activeTab === 'vehicle-details' && (
                <Button 
                  type="submit" 
                  className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
                  disabled={createVehicle.isPending || updateVehicle.isPending || !isFormValid()}
                >
                  {createVehicle.isPending || updateVehicle.isPending 
                    ? "Enregistrement..." 
                    : (mode === 'edit' ? "Mettre à jour" : "Enregistrer")
                  }
                </Button>
              )}
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default FleetVehicleForm;
