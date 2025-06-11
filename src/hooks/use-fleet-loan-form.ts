
import { useState } from 'react';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import { useAuth } from '@/contexts/AuthContext';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { LoanFormData, DamageItem } from '@/components/fleet/FleetLoanForm';

export const useFleetLoanForm = (vehicle: FleetVehicle, onSubmit: (loanData: LoanFormData) => void, defaultValues?: any) => {
  const [activeTab, setActiveTab] = useState('client-info');
  const { createReservation, updateReservation } = useFleetReservations();
  const { user } = useAuth();
  
  // Determine if we're editing an existing reservation
  const isEditing = Boolean(defaultValues?.id);
  
  // Helper function to format date for datetime-local input
  const formatDateTimeLocal = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Helper function to get current date/time for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    return formatDateTimeLocal(now.toISOString());
  };
  
  const [formData, setFormData] = useState<LoanFormData>({
    vehicleId: vehicle.id,
    clientId: defaultValues?.client_id || '',
    clientName: defaultValues?.clients ? `${defaultValues.clients.first_name} ${defaultValues.clients.last_name}` : '',
    clientPhone: defaultValues?.clients?.phone || '',
    clientEmail: defaultValues?.clients?.email || '',
    startDate: defaultValues?.start_date ? formatDateTimeLocal(defaultValues.start_date) : getCurrentDateTime(),
    expectedReturnDate: defaultValues?.expected_return_date ? formatDateTimeLocal(defaultValues.expected_return_date) : '',
    notes: defaultValues?.notes || '',
    mileage: defaultValues?.start_mileage || vehicle.mileage || 0,
    fuelLevel: defaultValues?.fuel_level_start || 100,
    vehicleImages: defaultValues?.vehicle_images || [],
    damages: defaultValues?.damages || [],
    driverLicenseFrontUrl: defaultValues?.driver_license_front_url || '',
    driverLicenseBackUrl: defaultValues?.driver_license_back_url || '',
    // New fields
    licenseNumber: defaultValues?.license_number || '',
    licenseIssueDate: defaultValues?.license_issue_date || '',
    prefecture: defaultValues?.prefecture || '',
    holderInfo: defaultValues?.holder_info || '',
    dateOfBirth: defaultValues?.date_of_birth || '',
    placeOfBirth: defaultValues?.place_of_birth || '',
    clientInsurance: defaultValues?.client_insurance || false,
    insuranceCompanyName: defaultValues?.insurance_company_name || '',
    insurancePhone: defaultValues?.insurance_phone || '',
    insuranceEmail: defaultValues?.insurance_email || '',
    insuranceContractNumber: defaultValues?.insurance_contract_number || '',
    insuranceAddress: defaultValues?.insurance_address || '',
    insuranceCity: defaultValues?.insurance_city || '',
    insurancePostalCode: defaultValues?.insurance_postal_code || '',
    attestationAccepted: defaultValues?.attestation_accepted || false,
    clientSignature: defaultValues?.client_signature || ''
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

      if (isEditing && defaultValues?.id) {
        // Update existing reservation
        await updateReservation.mutateAsync({
          id: defaultValues.id,
          data: reservationData
        });
      } else {
        // Create new reservation
        await createReservation.mutateAsync(reservationData);
      }
      
      onSubmit(formData);
    } catch (error) {
      console.error('Error saving reservation:', error);
    }
  };

  return {
    activeTab,
    setActiveTab,
    formData,
    createReservation: isEditing ? updateReservation : createReservation,
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
