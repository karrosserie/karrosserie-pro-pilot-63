
import { validateInvoiceForm } from '../utils/validation';
import { Invoice } from '@/services/supabase/invoices';

interface UseInvoiceFormHandlersProps {
  formData: Partial<Invoice>;
  claimNumber: string;
  isReadOnly: boolean;
  errors: Record<string, string>;
  setFormData: (updater: (prev: Partial<Invoice>) => Partial<Invoice>) => void;
  setClaimNumber: (value: string) => void;
  setErrors: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
}

export const useInvoiceFormHandlers = ({
  formData,
  claimNumber,
  isReadOnly,
  errors,
  setFormData,
  setClaimNumber,
  setErrors
}: UseInvoiceFormHandlersProps) => {
  const validateForm = () => {
    const validationResult = validateInvoiceForm(formData, claimNumber);
    setErrors(() => validationResult.errors);
    return validationResult.isValid;
  };

  const handleChange = (field: string, value: any) => {
    if (isReadOnly && field !== 'status') {
      return;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClaimNumberChange = (value: string) => {
    if (!isReadOnly) {
      setClaimNumber(value);
      if (errors.claim_number) {
        setErrors(prev => ({ ...prev, claim_number: '' }));
      }
    }
  };

  return {
    validateForm,
    handleChange,
    handleClaimNumberChange
  };
};
