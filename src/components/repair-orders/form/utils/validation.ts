
export const validateRepairOrderForm = (
  formData: any,
  claimNumber: string
) => {
  const newErrors: Record<string, string> = {};
  
  console.log('Starting repair order validation with:', { formData, claimNumber });
  
  if (!formData.reference?.trim()) {
    newErrors.reference = "Le numéro de l'ordre de réparation est obligatoire";
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

  // Validation pour le numéro de sinistre
  if (claimNumber && claimNumber.trim().length > 0 && claimNumber.trim().length < 3) {
    newErrors.claim_number = 'Le numéro de sinistre doit contenir au moins 3 caractères';
    console.log('Claim number error detected:', claimNumber);
  }
  
  console.log('Repair order validation complete. New errors:', newErrors);
  
  return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
};
