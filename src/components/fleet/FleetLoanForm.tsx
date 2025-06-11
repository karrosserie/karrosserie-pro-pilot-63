
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import DamageAssessmentTab from './form/DamageAssessmentTab';
import VehicleDetailsTab from './form/VehicleDetailsTab';
import ClientInfoTab from './form/ClientInfoTab';

interface FleetLoanFormProps {
  vehicle: FleetVehicle;
  onSubmit: (loanData: LoanFormData) => void;
  onCancel: () => void;
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
}

interface DamageItem {
  id: string;
  name: string;
  type: 'none' | 'rayure' | 'choc' | 'hs';
}

const FleetLoanForm: React.FC<FleetLoanFormProps> = ({
  vehicle,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<LoanFormData>({
    vehicleId: vehicle.id,
    clientId: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    startDate: new Date().toISOString().split('T')[0],
    expectedReturnDate: '',
    notes: '',
    mileage: vehicle.mileage || 0,
    fuelLevel: 100,
    vehicleImages: [],
    damages: [],
    driverLicenseFrontUrl: '',
    driverLicenseBackUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClientSelect = (clientId: string) => {
    setFormData(prev => ({ ...prev, clientId }));
  };

  const handleMileageChange = (mileage: number) => {
    setFormData(prev => ({ ...prev, mileage }));
  };

  const handleFuelLevelChange = (fuelLevel: number) => {
    setFormData(prev => ({ ...prev, fuelLevel }));
  };

  const handleImageAdd = (url: string) => {
    setFormData(prev => ({
      ...prev,
      vehicleImages: [...prev.vehicleImages, url]
    }));
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vehicleImages: prev.vehicleImages.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpdate = (index: number, url: string) => {
    setFormData(prev => ({
      ...prev,
      vehicleImages: prev.vehicleImages.map((img, i) => i === index ? url : img)
    }));
  };

  const handleDamageUpdate = (damages: DamageItem[]) => {
    setFormData(prev => ({ ...prev, damages }));
  };

  const handleDriverLicenseFrontUpload = (url: string) => {
    setFormData(prev => ({ ...prev, driverLicenseFrontUrl: url }));
  };

  const handleDriverLicenseBackUpload = (url: string) => {
    setFormData(prev => ({ ...prev, driverLicenseBackUrl: url }));
  };

  const isFormValid = () => {
    return formData.clientId && 
           formData.startDate && 
           formData.expectedReturnDate &&
           formData.driverLicenseFrontUrl &&
           formData.driverLicenseBackUrl;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Prêt du véhicule: {vehicle.brand} {vehicle.model} ({vehicle.license_plate})
        </h3>
      </div>

      <Tabs defaultValue="client-info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="client-info">Informations sur le client</TabsTrigger>
          <TabsTrigger value="damages">Chocs & rayures</TabsTrigger>
          <TabsTrigger value="vehicle-details">Détails du véhicule & photos</TabsTrigger>
        </TabsList>

        <TabsContent value="client-info" className="space-y-6 mt-6">
          <ClientInfoTab
            formData={formData}
            onInputChange={handleInputChange}
            onClientSelect={handleClientSelect}
            onDriverLicenseFrontUpload={handleDriverLicenseFrontUpload}
            onDriverLicenseBackUpload={handleDriverLicenseBackUpload}
          />
        </TabsContent>

        <TabsContent value="damages" className="space-y-6 mt-6">
          <DamageAssessmentTab
            damages={formData.damages}
            onDamageUpdate={handleDamageUpdate}
          />
        </TabsContent>

        <TabsContent value="vehicle-details" className="space-y-6 mt-6">
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
      </Tabs>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          Confirmer le prêt
        </Button>
      </div>
    </div>
  );
};

export default FleetLoanForm;
