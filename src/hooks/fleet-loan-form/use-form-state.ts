
import { useState, useEffect } from 'react';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { LoanFormData } from '@/components/fleet/FleetLoanForm';
import { formatDateTimeLocal, getCurrentDateTime } from './utils';
import { supabase } from '@/integrations/supabase/client';

export const useFleetLoanFormState = (vehicle: FleetVehicle, defaultValues?: any) => {
  const [activeTab, setActiveTab] = useState('client-info');
  
  const [formData, setFormData] = useState<LoanFormData>({
    vehicleId: vehicle.id,
    clientId: defaultValues?.client_id || '',
    quoteId: defaultValues?.quote_id || '',
    clientName: defaultValues?.clients ? `${defaultValues.clients.first_name} ${defaultValues.clients.last_name}` : '',
    clientPhone: defaultValues?.clients?.phone || '',
    clientEmail: defaultValues?.clients?.email || '',
    startDate: defaultValues?.start_date ? formatDateTimeLocal(defaultValues.start_date) : getCurrentDateTime(),
    expectedReturnDate: defaultValues?.expected_return_date ? formatDateTimeLocal(defaultValues.expected_return_date) : '',
    notes: defaultValues?.notes || '',
    mileage: defaultValues?.start_mileage || vehicle.mileage || 0,
    fuelLevel: defaultValues?.fuel_level_start || 100,
    vehicleImages: Array.isArray(defaultValues?.vehicle_images) ? defaultValues.vehicle_images : [],
    damages: defaultValues?.damages || [],
    driverLicenseFrontUrl: defaultValues?.clients?.driver_license_front_url || '',
    driverLicenseBackUrl: defaultValues?.clients?.driver_license_back_url || '',
    // License fields from client data
    licenseNumber: defaultValues?.clients?.license_number || '',
    licenseIssueDate: defaultValues?.clients?.license_issue_date || '',
    prefecture: defaultValues?.clients?.prefecture || '',
    holderInfo: defaultValues?.clients?.first_name && defaultValues?.clients?.last_name 
      ? `${defaultValues.clients.first_name} ${defaultValues.clients.last_name}` 
      : '',
    dateOfBirth: defaultValues?.clients?.date_of_birth || '',
    placeOfBirth: defaultValues?.clients?.place_of_birth || '',
    clientInsurance: defaultValues?.client_insurance || false,
    insuranceCompanyName: defaultValues?.insurance_company_name || '',
    insurancePhone: defaultValues?.insurance_phone || '',
    insuranceEmail: defaultValues?.insurance_email || '',
    insuranceContractNumber: defaultValues?.insurance_contract_number || '',
    insuranceAddress: defaultValues?.insurance_address || '',
    insuranceCity: defaultValues?.insurance_city || '',
    insurancePostalCode: defaultValues?.insurance_postal_code || '',
    // Assistance fields
    hasAssistance: defaultValues?.has_assistance || false,
    assistanceCaseNumber: defaultValues?.assistance_case_number || '',
    assistanceEmail: defaultValues?.assistance_email || '',
    attestationAccepted: defaultValues?.attestation_accepted || false,
    clientSignature: defaultValues?.client_signature || ''
  });

  // Effect to auto-fill client data when clientId changes
  useEffect(() => {
    const fetchClientData = async () => {
      if (formData.clientId && !defaultValues?.clients) {
        try {
          const { data: client, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', formData.clientId)
            .single();

          if (error) {
            console.error('Error fetching client data:', error);
            return;
          }

          if (client) {
            setFormData(prev => ({
              ...prev,
              clientName: `${client.first_name} ${client.last_name}`,
              clientPhone: client.phone || '',
              clientEmail: client.email || '',
              driverLicenseFrontUrl: client.driver_license_front_url || '',
              driverLicenseBackUrl: client.driver_license_back_url || '',
              licenseNumber: client.license_number || '',
              licenseIssueDate: client.license_issue_date || '',
              prefecture: client.prefecture || '',
              holderInfo: `${client.first_name} ${client.last_name}`,
              dateOfBirth: client.date_of_birth || '',
              placeOfBirth: client.place_of_birth || ''
            }));
          }
        } catch (error) {
          console.error('Error in fetchClientData:', error);
        }
      }
    };

    fetchClientData();
  }, [formData.clientId, defaultValues?.clients]);

  return {
    activeTab,
    setActiveTab,
    formData,
    setFormData
  };
};
