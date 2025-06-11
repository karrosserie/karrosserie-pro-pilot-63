
import { useState } from 'react';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { LoanFormData } from '@/components/fleet/FleetLoanForm';
import { formatDateTimeLocal, getCurrentDateTime } from './utils';

export const useFleetLoanFormState = (vehicle: FleetVehicle, defaultValues?: any) => {
  const [activeTab, setActiveTab] = useState('client-info');
  
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

  return {
    activeTab,
    setActiveTab,
    formData,
    setFormData
  };
};
