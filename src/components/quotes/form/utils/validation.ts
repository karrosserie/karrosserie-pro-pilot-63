
export const validateQuoteForm = (
  formData: any,
  claimNumber: string
) => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.reference?.trim()) {
    newErrors.reference = 'Le numéro du devis est obligatoire';
  }
  
  if (!formData.client_id) {
    newErrors.client_id = 'Le client est obligatoire';
  }

  if (!formData.vehicle_id) {
    newErrors.vehicle_id = 'Le véhicule est obligatoire';
  }

  if (!formData.valid_until) {
    newErrors.valid_until = 'La date de validité est obligatoire';
  }

  // Validation pour les nouveaux champs
  if (claimNumber && claimNumber.trim().length > 0 && claimNumber.trim().length < 3) {
    newErrors.claim_number = 'Le numéro de sinistre doit contenir au moins 3 caractères';
  }

  return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
};
