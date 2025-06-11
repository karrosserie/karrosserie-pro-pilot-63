
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
}

interface DamageItem {
  id: string;
  name: string;
  rayure: number;
  choc: number;
  hs: number;
}

const FleetLoanForm: React.FC<FleetLoanFormProps> = ({
  vehicle,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<LoanFormData>({
    vehicleId: vehicle.id,
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    startDate: new Date().toISOString().split('T')[0],
    expectedReturnDate: '',
    notes: '',
    mileage: vehicle.mileage || 0,
    fuelLevel: 100,
    vehicleImages: [],
    damages: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Prêt du véhicule: {vehicle.brand} {vehicle.model} ({vehicle.license_plate})
        </h3>
      </div>

      <Tabs defaultValue="damages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="damages">Chocs & rayures</TabsTrigger>
          <TabsTrigger value="vehicle-details">Détails du véhicule & photos</TabsTrigger>
          <TabsTrigger value="client-info">Informations sur le client</TabsTrigger>
        </TabsList>

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

        <TabsContent value="client-info" className="space-y-6 mt-6">
          <ClientInfoTab
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={onCancel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FleetLoanForm;
