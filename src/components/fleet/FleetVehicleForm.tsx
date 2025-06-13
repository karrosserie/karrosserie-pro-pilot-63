import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { useFleetVehicleForm } from '@/hooks/use-fleet-vehicle-form';
import FleetVehicleBasicInfo from './form/FleetVehicleBasicInfo';
import FleetVehicleDetails from './form/FleetVehicleDetails';
import DocumentsTab from './form/DocumentsTab';
import { useToast } from '@/hooks/use-toast';
import { isValidVin, decodeVin } from '@/services/vin-decoder';
import { useCarBrands } from '@/hooks/use-car-brands';

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
  const { carBrands } = useCarBrands();
  const isViewMode = mode === 'view';
  const [activeTab, setActiveTab] = useState('vehicle-info');

  const { formData, setFormData, handleInputChange, handleSelectChange } = useFleetVehicleForm(vehicle);
  
  const [documentsData, setDocumentsData] = useState({
    registrationFrontUrl: vehicle?.registration_front_url || '',
    registrationBackUrl: vehicle?.registration_back_url || '',
    insuranceCardUrl: vehicle?.insurance_card_url || ''
  });

  const handleVinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'vin') {
      const upperValue = value.toUpperCase();
      setFormData(prev => ({ ...prev, vin: upperValue }));
      
      // Auto-decode VIN if valid
      if (isValidVin(upperValue)) {
        const vinInfo = decodeVin(upperValue);
        console.log('VIN décodé:', vinInfo);
        
        if (vinInfo.brand && carBrands.length > 0) {
          const matchingBrand = carBrands.find(brand => 
            brand.name.toLowerCase() === vinInfo.brand?.toLowerCase()
          );
          
          if (matchingBrand) {
            console.log('Marque détectée par VIN:', matchingBrand.name);
            setFormData(prev => ({
              ...prev,
              brand_id: matchingBrand.id,
              year: vinInfo.year || prev.year
            }));
          }
        }
      }
    } else {
      handleInputChange(e);
    }
  };

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

  const handleRegistrationFrontUpload = (url: string) => {
    setDocumentsData(prev => ({ ...prev, registrationFrontUrl: url }));
  };

  const handleRegistrationBackUpload = (url: string) => {
    setDocumentsData(prev => ({ ...prev, registrationBackUrl: url }));
  };

  const handleInsuranceCardUpload = (url: string) => {
    setDocumentsData(prev => ({ ...prev, insuranceCardUrl: url }));
  };

  const isFormValid = () => {
    const basicInfoValid = formData.vin && formData.brand_id && formData.model_id && formData.license_plate;
    const documentsValid = documentsData.registrationFrontUrl && 
                          documentsData.registrationBackUrl && 
                          documentsData.insuranceCardUrl;
    
    return basicInfoValid && documentsValid;
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

    if (!isFormValid()) {
      toast({
        title: "Documents manquants",
        description: "Veuillez importer tous les documents obligatoires (certificat d'immatriculation recto/verso et carte verte d'assurance).",
        variant: "destructive"
      });
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
              {activeTab === 'documents' && (
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
