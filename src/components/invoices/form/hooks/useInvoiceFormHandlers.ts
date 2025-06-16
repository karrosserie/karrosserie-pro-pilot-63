
import { validateInvoiceForm } from '../utils/validation';
import { Invoice } from '@/services/supabase/invoices';

interface UseInvoiceFormHandlersProps {
  formData: Partial<Invoice>;
  description: string;
  claimNumber: string;
  currentMileage: string;
  isReadOnly: boolean;
  errors: Record<string, string>;
  setFormData: (updater: (prev: Partial<Invoice>) => Partial<Invoice>) => void;
  setDescription: (value: string) => void;
  setClaimNumber: (value: string) => void;
  setCurrentMileage: (value: string) => void;
  setErrors: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
}

export const useInvoiceFormHandlers = ({
  formData,
  description,
  claimNumber,
  currentMileage,
  isReadOnly,
  errors,
  setFormData,
  setDescription,
  setClaimNumber,
  setCurrentMileage,
  setErrors
}: UseInvoiceFormHandlersProps) => {
  const validateForm = () => {
    const validationResult = validateInvoiceForm(formData, claimNumber, currentMileage);
    setErrors(() => validationResult.errors);
    return validationResult.isValid;
  };

  const handleChange = (field: string, value: any) => {
    if (isReadOnly && field !== 'status') {
      return;
    }
    
    if (field === 'description') {
      setDescription(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
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

  const handleCurrentMileageChange = (value: string) => {
    if (!isReadOnly) {
      setCurrentMileage(value);
      if (errors.current_mileage) {
        setErrors(prev => ({ ...prev, current_mileage: '' }));
      }
    }
  };

  return {
    validateForm,
    handleChange,
    handleClaimNumberChange,
    handleCurrentMileageChange
  };
};
