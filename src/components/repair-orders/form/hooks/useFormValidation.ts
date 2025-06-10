
import { validateRepairOrderForm } from '../utils/validation';

export const useFormValidation = (
  formData: any,
  claimNumber: string,
  currentMileage: string,
  setErrors: (errors: Record<string, string>) => void
) => {
  const validateForm = () => {
    console.log('Validating form with data:', formData);
    const validationResult = validateRepairOrderForm(formData, claimNumber, currentMileage);
    setErrors(validationResult.errors);
    return validationResult.isValid;
  };

  const clearFieldError = (field: string, errors: Record<string, string>) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return {
    validateForm,
    clearFieldError
  };
};
