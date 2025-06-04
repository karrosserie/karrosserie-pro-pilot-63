
export const validateQuoteForm = (
  formData: any,
  claimNumber: string,
  currentMileage: string
) => {
  const newErrors: Record<string, string> = {};
  
  console.log('Starting validation with:', { formData, claimNumber, currentMileage });
  
  if (!formData.reference?.trim()) {
    newErrors.reference = 'Le numéro du devis est obligatoire';
    console.log('Reference error detected');
  }
  
  if (!formData.client_id) {
    newErrors.client_id = 'Le client est obligatoire';
    console.log('Client error detected');
  }

  if (!formData.vehicle_id) {
    newErrors.vehicle_id = 'Le véhicule est obligatoire';
    console.log('Vehicle error detected');
  }

  if (!formData.valid_until) {
    newErrors.valid_until = 'La date de validité est obligatoire';
    console.log('Valid until error detected');
  }

  // Validation pour les nouveaux champs
  if (claimNumber && claimNumber.trim().length > 0 && claimNumber.trim().length < 3) {
    newErrors.claim_number = 'Le numéro de sinistre doit contenir au moins 3 caractères';
    console.log('Claim number error detected:', claimNumber);
  }

  if (currentMileage && currentMileage.trim().length > 0) {
    const mileageNum = parseInt(currentMileage);
    if (isNaN(mileageNum) || mileageNum < 0 || mileageNum > 999999) {
      newErrors.current_mileage = 'Le kilométrage doit être un nombre entre 0 et 999999 km';
      console.log('Current mileage error detected:', currentMileage);
    }
  }
  
  console.log('Validation complete. New errors:', newErrors);
  
  return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
};
