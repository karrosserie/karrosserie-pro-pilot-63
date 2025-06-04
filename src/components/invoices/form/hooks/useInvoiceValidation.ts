
import { validateInvoiceForm } from '../utils/validation';
import { Invoice } from '@/services/supabase/invoices';

export const useInvoiceValidation = () => {
  const validateForm = (
    formData: Partial<Invoice>,
    claimNumber: string,
    currentMileage: string,
    setErrors: (errors: Record<string, string>) => void
  ) => {
    const validationResult = validateInvoiceForm(formData, claimNumber, currentMileage);
    setErrors(validationResult.errors);
    return validationResult.isValid;
  };

  return { validateForm };
};
