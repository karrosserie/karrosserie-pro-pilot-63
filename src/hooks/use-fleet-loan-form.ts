
import { useState } from 'react';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import { useAuth } from '@/contexts/AuthContext';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { LoanFormData, DamageItem } from '@/components/fleet/FleetLoanForm';

export const useFleetLoanForm = (vehicle: FleetVehicle, onSubmit: (loanData: LoanFormData) => void) => {
  const [activeTab, setActiveTab] = useState('client-info');
  const { createReservation } = useFleetReservations();
  const { user } = useAuth();
  
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
    console.log('useFleetLoanForm - Adding image:', url);
    console.log('Current vehicleImages:', formData.vehicleImages);
    
    setFormData(prev => {
      const newImages = [...prev.vehicleImages, url];
      console.log('New vehicleImages after add:', newImages);
      return {
        ...prev,
        vehicleImages: newImages
      };
    });
  };

  const handleImageRemove = (index: number) => {
    console.log('useFleetLoanForm - Removing image at index:', index);
    setFormData(prev => {
      const newImages = prev.vehicleImages.filter((_, i) => i !== index);
      console.log('New vehicleImages after remove:', newImages);
      return {
        ...prev,
        vehicleImages: newImages
      };
    });
  };

  const handleImageUpdate = (index: number, url: string) => {
    console.log('useFleetLoanForm - Updating image at index:', index, 'with url:', url);
    setFormData(prev => {
      const newImages = [...prev.vehicleImages];
      newImages[index] = url;
      console.log('New vehicleImages after update:', newImages);
      return {
        ...prev,
        vehicleImages: newImages
      };
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    try {
      // Prepare data for database with proper JSON conversion
      const reservationData = {
        fleet_vehicle_id: formData.vehicleId,
        client_id: formData.clientId,
        start_date: formData.startDate,
        expected_return_date: formData.expectedReturnDate,
        start_mileage: formData.mileage,
        fuel_level_start: formData.fuelLevel,
        notes: formData.notes || '',
        status: 'active' as const,
        user_id: user.id,
        // License information
        license_number: formData.licenseNumber,
        license_issue_date: formData.licenseIssueDate,
        prefecture: formData.prefecture,
        holder_info: formData.holderInfo,
        date_of_birth: formData.dateOfBirth,
        place_of_birth: formData.placeOfBirth,
        // Document URLs
        driver_license_front_url: formData.driverLicenseFrontUrl,
        driver_license_back_url: formData.driverLicenseBackUrl,
        // Insurance information
        client_insurance: formData.clientInsurance,
        insurance_company_name: formData.insuranceCompanyName,
        insurance_phone: formData.insurancePhone,
        insurance_email: formData.insuranceEmail,
        insurance_contract_number: formData.insuranceContractNumber,
        insurance_address: formData.insuranceAddress,
        insurance_city: formData.insuranceCity,
        insurance_postal_code: formData.insurancePostalCode,
        // Attestation
        attestation_accepted: formData.attestationAccepted,
        client_signature: formData.clientSignature,
        // Convert arrays to JSON format for database storage
        vehicle_images: formData.vehicleImages as any,
        damages: formData.damages as any
      };

      await createReservation.mutateAsync(reservationData);
      onSubmit(formData);
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return {
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
  };
};
