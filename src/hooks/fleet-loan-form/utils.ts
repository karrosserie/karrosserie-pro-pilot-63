
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

// Helper function to prepare reservation data for database
export const prepareReservationData = (formData: any, vehicleId: string, userId: string) => {
  return {
    fleet_vehicle_id: vehicleId,
    client_id: formData.clientId,
    start_date: formData.startDate,
    expected_return_date: formData.expectedReturnDate || null, // Convert empty string to null
    start_mileage: formData.mileage,
    fuel_level_start: formData.fuelLevel,
    notes: formData.notes || '',
    status: 'active' as const,
    user_id: userId,
    // License information
    license_number: formData.licenseNumber,
    license_issue_date: formData.licenseIssueDate || null, // Convert empty string to null
    prefecture: formData.prefecture,
    holder_info: formData.holderInfo,
    date_of_birth: formData.dateOfBirth || null, // Convert empty string to null
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
};
