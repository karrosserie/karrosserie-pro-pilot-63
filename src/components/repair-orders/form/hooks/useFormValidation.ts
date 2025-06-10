
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
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  return {
    validateForm,
    clearFieldError
  };
};
