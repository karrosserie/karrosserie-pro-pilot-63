import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
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
  const [activeTab, setActiveTab] = useState('client-info');
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
    driverLicenseBackUrl: '',
    // New fields
    licenseNumber: '',
    licenseIssueDate: '',
    prefecture: '',
    holderInfo: '',
    dateOfBirth: '',
    placeOfBirth: '',
    clientInsurance: false,
    insuranceCompanyName: '',
    insurancePhone: '',
    insuranceEmail: '',
    insuranceContractNumber: '',
    insuranceAddress: '',
    insuranceCity: '',
    insurancePostalCode: '',
    attestationAccepted: false,
    clientSignature: ''
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

  const handleInsuranceSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, clientInsurance: checked }));
  };

  const handleInsurancePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, insurancePhone: value || '' }));
  };

  const handleSignatureChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    // Validation des dates
    const isDateValid = () => {
      if (!formData.startDate || !formData.expectedReturnDate) return false;
      return new Date(formData.expectedReturnDate) > new Date(formData.startDate);
    };

    const basicValid = formData.clientId && 
                      formData.startDate && 
                      formData.expectedReturnDate &&
                      isDateValid() &&
                      formData.driverLicenseFrontUrl &&
                      formData.driverLicenseBackUrl &&
                      formData.licenseNumber &&
                      formData.licenseIssueDate &&
                      formData.prefecture &&
                      formData.holderInfo &&
                      formData.dateOfBirth &&
                      formData.placeOfBirth &&
                      formData.attestationAccepted &&
                      formData.clientSignature && 
                      formData.clientSignature.trim() !== '';

    const insuranceValid = !formData.clientInsurance || (
      formData.insuranceCompanyName &&
      formData.insurancePhone &&
      formData.insuranceEmail &&
      formData.insuranceContractNumber &&
      formData.insuranceAddress &&
      formData.insuranceCity &&
      formData.insurancePostalCode
    );

    return basicValid && insuranceValid;
  };

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
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

        <TabsContent value="insurance" className="space-y-6 mt-6">
          <InsuranceTab
            formData={formData}
            onInputChange={handleInputChange}
            onSwitchChange={handleInsuranceSwitchChange}
            onPhoneChange={handleInsurancePhoneChange}
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

        <TabsContent value="attestation" className="space-y-6 mt-6">
          <AttestationTab
            formData={formData}
            vehicle={vehicle}
            onInputChange={handleInputChange}
            onSignatureChange={handleSignatureChange}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center pt-6 border-t">
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
              disabled={!isFormValid()}
            >
              Confirmer le prêt
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FleetLoanForm;

}
