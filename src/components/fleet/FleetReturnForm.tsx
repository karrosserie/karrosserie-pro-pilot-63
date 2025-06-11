
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import DamageAssessmentTab from './form/DamageAssessmentTab';
import VehicleDetailsTab from './form/VehicleDetailsTab';
import AttestationTab from './form/AttestationTab';
import { DamageItem } from './FleetLoanForm';

interface FleetReturnFormProps {
  vehicle: FleetVehicle;
  reservation: any;
  onSubmit: (returnData: ReturnFormData) => void;
  onCancel: () => void;
}

export interface ReturnFormData {
  vehicleId: string;
  reservationId: string;
  returnMileage: number;
  returnFuelLevel: number;
  returnVehicleImages: string[];
  returnDamages: DamageItem[];
  returnNotes?: string;
  attestationAccepted?: boolean;
  clientSignature?: string;
}

const FleetReturnForm: React.FC<FleetReturnFormProps> = ({
  vehicle,
  reservation,
  onSubmit,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('damages');
  const [formData, setFormData] = useState<ReturnFormData>({
    vehicleId: vehicle.id,
    reservationId: reservation.id,
    returnMileage: vehicle.mileage || 0,
    returnFuelLevel: 100,
    returnVehicleImages: [],
    returnDamages: [],
    returnNotes: '',
    attestationAccepted: false,
    clientSignature: ''
  });

  const handleMileageChange = (mileage: number) => {
    setFormData(prev => ({ ...prev, returnMileage: mileage }));
  };

  const handleFuelLevelChange = (fuelLevel: number) => {
    setFormData(prev => ({ ...prev, returnFuelLevel: fuelLevel }));
  };

  const handleImageAdd = (url: string) => {
    setFormData(prev => ({
      ...prev,
      returnVehicleImages: [...prev.returnVehicleImages, url]
    }));
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      returnVehicleImages: prev.returnVehicleImages.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpdate = (index: number, url: string) => {
    setFormData(prev => {
      const newImages = [...prev.returnVehicleImages];
      newImages[index] = url;
      return {
        ...prev,
        returnVehicleImages: newImages
      };
    });
  };

  const handleDamageUpdate = (damages: DamageItem[]) => {
    setFormData(prev => ({ ...prev, returnDamages: damages }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignatureChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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

  const displayImages = formData.returnVehicleImages.length === 0 ? [''] : formData.returnVehicleImages;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Retour du véhicule: {vehicle.brand} {vehicle.model} ({vehicle.license_plate})
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Client: {reservation.clients?.first_name} {reservation.clients?.last_name}
        </p>
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
            damages={formData.returnDamages}
            onDamageUpdate={handleDamageUpdate}
            isViewMode={false}
          />
        </TabsContent>

        <TabsContent value="vehicle-details" className="space-y-6">
          <VehicleDetailsTab
            vehicleId={vehicle.id}
            mileage={formData.returnMileage}
            fuelLevel={formData.returnFuelLevel}
            vehicleImages={displayImages}
            onMileageChange={handleMileageChange}
            onFuelLevelChange={handleFuelLevelChange}
            onImageAdd={handleImageAdd}
            onImageRemove={handleImageRemove}
            onImageUpdate={handleImageUpdate}
            isViewMode={false}
          />
        </TabsContent>

        <TabsContent value="attestation" className="space-y-6">
          <AttestationTab
            formData={formData}
            vehicle={vehicle}
            onInputChange={handleInputChange}
            onSignatureChange={handleSignatureChange}
            isViewMode={false}
          />
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t flex-shrink-0">
        <div>
          {!isFirstTab && (
            <Button type="button" variant="outline" onClick={handlePrevious}>
              Précédent
            </Button>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          
          {!isLastTab ? (
            <Button type="button" onClick={handleNext}>
              Suivant
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="btn-primary"
              onClick={handleSubmit}
            >
              Valider le retour
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FleetReturnForm;
