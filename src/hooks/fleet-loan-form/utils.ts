import { LoanFormData } from '@/components/fleet/FleetLoanForm';
import { supabase } from '@/integrations/supabase/client';

// Helper function to format date for datetime-local input
export const formatDateTimeLocal = (dateString: string) => {
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
export const getCurrentDateTime = () => {
  const now = new Date();
  return formatDateTimeLocal(now.toISOString());
};

export const prepareReservationData = async (formData: LoanFormData, vehicleId: string, companyId: string) => {
  console.log('Preparing reservation data for form:', formData);
  
  // Le prêt est toujours actif dès sa création (le devis sert uniquement à la facturation)
  const status = 'active';
  
  // First, update the client with license information
  if (formData.clientId) {
    const clientUpdateData = {
      driver_license_front_url: formData.driverLicenseFrontUrl || null,
      driver_license_back_url: formData.driverLicenseBackUrl || null,
      license_number: formData.licenseNumber || null,
      license_issue_date: formData.licenseIssueDate || null,
      prefecture: formData.prefecture || null,
      date_of_birth: formData.dateOfBirth || null,
      place_of_birth: formData.placeOfBirth || null
    };
    
    // Remove null values
    const filteredClientData = Object.fromEntries(
      Object.entries(clientUpdateData).filter(([_, value]) => value !== null)
    );
    
    if (Object.keys(filteredClientData).length > 0) {
      const { error: clientError } = await supabase
        .from('clients')
        .update(filteredClientData)
        .eq('id', formData.clientId);
        
      if (clientError) {
        console.error('Error updating client:', clientError);
        throw new Error('Failed to update client information');
      }
    }
  }

  // Prepare reservation data (without license fields that are now in clients table)
  const reservationData = {
    fleet_vehicle_id: vehicleId,
    client_id: formData.clientId,
    quote_id: formData.quoteId || null,
    status: status,
    start_date: formData.startDate,
    expected_return_date: formData.expectedReturnDate || null,
    start_mileage: formData.mileage,
    fuel_level_start: formData.fuelLevel,
    vehicle_images: JSON.stringify(formData.vehicleImages),
    damages: JSON.stringify(formData.damages),
    client_insurance: formData.clientInsurance || false,
    insurance_company_name: formData.insuranceCompanyName || null,
    insurance_phone: formData.insurancePhone || null,
    insurance_email: formData.insuranceEmail || null,
    insurance_contract_number: formData.insuranceContractNumber || null,
    insurance_address: formData.insuranceAddress || null,
    insurance_city: formData.insuranceCity || null,
    insurance_postal_code: formData.insurancePostalCode || null,
    // Assistance fields
    has_assistance: formData.hasAssistance || false,
    assistance_case_number: formData.assistanceCaseNumber || null,
    assistance_email: formData.assistanceEmail || null,
    coverage_duration: formData.assistanceFormula || null,
    attestation_accepted: formData.attestationAccepted || false,
    client_signature: formData.clientSignature || null,
    notes: formData.notes || null,
    company_id: companyId
  };

  console.log('Final reservation data:', reservationData);
  return reservationData;
};