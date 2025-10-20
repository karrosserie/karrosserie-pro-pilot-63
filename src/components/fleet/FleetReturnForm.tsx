import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useFleetReturnForm } from '@/hooks/fleet-return-form';
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
  isViewMode?: boolean;
}

const FleetReturnForm: React.FC<FleetReturnFormProps> = ({
  vehicle,
  reservationId,
  onSubmit,
  onCancel,
  isViewMode = false
}) => {
  const {
    activeTab,
    setActiveTab,
    formData,
    reservation,
    fleetReturn,
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

  const getVehicleDisplayName = () => {
    if (vehicle.car_brands?.name && vehicle.car_models?.name) {
      return `${vehicle.car_brands.name} ${vehicle.car_models.name}`;
    }
    return 'Véhicule';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pb-2 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          <div className="col-span-4 space-y-2">
            <h3 className="text-base md:text-lg font-medium text-gray-900">
              {getVehicleDisplayName()} ({vehicle.license_plate})
            </h3>
            <div className="text-sm">Client : {formData.clientName}</div>
            {fleetReturn && (
              <div className="text-sm text-green-600">
                ✓ Retour déjà effectué le {new Date(fleetReturn.return_date).toLocaleDateString('fr-FR')}
              </div>
            )}
          </div>
    
          {/* Date et heure de retour field - outside tabs */}
          <div className="space-y-2">
            <Label htmlFor="returnDate">Date et heure de retour</Label>
            <Input
              id="returnDate"
              name="returnDate"
              type="datetime-local"
              value={formData.returnDate}
              onChange={handleInputChange}
              className="mt-2"
              disabled={isViewMode}
            />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
        <div className="px-4 shrink-0">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-[10px] md:text-sm px-1 md:px-3 py-1.5 md:py-2">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4" style={{ paddingBottom: '120px' }}>

        <TabsContent value="damages" className="space-y-4 md:space-y-6 mt-0">
          <ReturnDamageAssessmentTab
            damages={formData.damages}
            onDamageUpdate={handleDamageUpdate}
            isViewMode={isViewMode}
          />
        </TabsContent>

        <TabsContent value="vehicle-details" className="space-y-4 md:space-y-6 mt-0">
          <VehicleDetailsTab
            vehicleId={vehicle.id}
            mileage={formData.returnMileage}
            fuelLevel={formData.fuelLevelReturn}
            vehicleImages={formData.vehicleImages.map((img: any) => 
              typeof img === 'string' ? { url: img, timing: 'Avant' as const } : img
            )}
            onMileageChange={handleMileageChange}
            onFuelLevelChange={handleFuelLevelChange}
            onImageAdd={handleImageAdd}
            onImageRemove={handleImageRemove}
            onImageUpdate={handleImageUpdate}
            onImageTimingUpdate={(index, timing) => {
              // Stub pour le moment - peut être implémenté plus tard
              console.log('Timing update:', index, timing);
            }}
            isViewMode={isViewMode}
            showTimingSelector={false}
          />
        </TabsContent>

        <TabsContent value="attestation" className="space-y-4 md:space-y-6 mt-0">
          <ReturnAttestationTab
            formData={{
              clientId: formData.clientId,
              clientName: formData.clientName,
              returnDate: formData.returnDate,
              returnMileage: formData.returnMileage,
              attestationAccepted: formData.attestationAccepted,
              clientSignature: formData.clientSignature
            }}
            vehicle={vehicle}
            reservation={reservation}
            onInputChange={handleInputChange}
            onSignatureChange={handleSignatureChange}
            isViewMode={isViewMode}
          />
        </TabsContent>
        </div>
      </Tabs>

      <div className="px-4 pb-4 pt-2 shrink-0 border-t bg-background">
      {!isViewMode && (
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
      )}

      {isViewMode && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Fermer
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default FleetReturnForm;
