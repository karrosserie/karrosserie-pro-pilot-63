
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useFleetLoanForm } from '@/hooks/use-fleet-loan-form';
import { useFleetLoanFormValidation } from './form/FleetLoanFormValidation';
import FleetLoanFormNavigation from './form/FleetLoanFormNavigation';
import DamageAssessmentTab from './form/DamageAssessmentTab';
import VehicleDetailsTab from './form/VehicleDetailsTab';
import ClientInfoTab from './form/ClientInfoTab';
import InsuranceTab from './form/InsuranceTab';
import AttestationTab from './form/AttestationTab';

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
  // New license fields
  licenseNumber?: string;
  licenseIssueDate?: string;
  prefecture?: string;
  holderInfo?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  // Insurance fields
  clientInsurance?: boolean;
  insuranceCompanyName?: string;
  insurancePhone?: string;
  insuranceEmail?: string;
  insuranceContractNumber?: string;
  insuranceAddress?: string;
  insuranceCity?: string;
  insurancePostalCode?: string;
  // Attestation fields
  attestationAccepted?: boolean;
  clientSignature?: string;
}

export interface DamageItem {
  id: string;
  name: string;
  type: 'none' | 'rayure' | 'choc' | 'hs';
}

const FleetLoanForm: React.FC<FleetLoanFormProps> = ({
  vehicle,
  onSubmit,
  onCancel
}) => {
  const {
    activeTab,
    setActiveTab,
    formData,
    createReservation,
    handleInputChange,
    handleClientSelect,
    handleMileageChange,
    handleFuelLevelChange,
    handleImageAdd,
    handleImageRemove,
    handleImageUpdate,
    handleDamageUpdate,
    handleDriverLicenseFrontUpload,
    handleDriverLicenseBackUpload,
    handleInsuranceSwitchChange,
    handleInsurancePhoneChange,
    handleSignatureChange,
    handleSubmit
  } = useFleetLoanForm(vehicle, onSubmit);

  const { isFormValid } = useFleetLoanFormValidation(formData);

  const tabs = [
    { value: 'client-info', label: 'Informations sur le client' },
    { value: 'insurance', label: 'Assurance' },
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
          Prêt du véhicule: {vehicle.brand} {vehicle.model} ({vehicle.license_plate})
        </h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="client-info" className="space-y-6">
          <ClientInfoTab
            formData={formData}
            onInputChange={handleInputChange}
            onClientSelect={handleClientSelect}
            onDriverLicenseFrontUpload={handleDriverLicenseFrontUpload}
            onDriverLicenseBackUpload={handleDriverLicenseBackUpload}
          />
        </TabsContent>

        <TabsContent value="insurance" className="space-y-6">
          <InsuranceTab
            formData={formData}
            onInputChange={handleInputChange}
            onSwitchChange={handleInsuranceSwitchChange}
            onPhoneChange={handleInsurancePhoneChange}
          />
        </TabsContent>

        <TabsContent value="damages" className="space-y-6">
          <DamageAssessmentTab
            damages={formData.damages}
            onDamageUpdate={handleDamageUpdate}
          />
        </TabsContent>

        <TabsContent value="vehicle-details" className="space-y-6">
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

        <TabsContent value="attestation" className="space-y-6">
          <AttestationTab
            formData={formData}
            vehicle={vehicle}
            onInputChange={handleInputChange}
            onSignatureChange={handleSignatureChange}
          />
        </TabsContent>
      </Tabs>

      <FleetLoanFormNavigation
        activeTab={activeTab}
        onCancel={onCancel}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isFormValid={Boolean(isFormValid())}
        isPending={createReservation.isPending}
        isFirstTab={isFirstTab}
        isLastTab={isLastTab}
      />
    </div>
  );
};

export default FleetLoanForm;
