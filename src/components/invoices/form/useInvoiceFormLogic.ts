
import { useEffect } from 'react';
import { Invoice } from '@/services/supabase/invoices';
import { calculateGlobalTotals } from './hooks/useInvoiceCalculations';
import { useInvoiceFormData } from './hooks/useInvoiceFormData';
import { useInvoiceFormHandlers } from './hooks/useInvoiceFormHandlers';
import { useInvoiceDataPreparation } from './hooks/useInvoiceDataPreparation';
import { useInvoiceFormInitialization } from './hooks/useInvoiceFormInitialization';

interface UseInvoiceFormLogicProps {
  invoice?: Invoice | null;
}

export const useInvoiceFormLogic = ({ invoice }: UseInvoiceFormLogicProps) => {
  const {
    formData,
    setFormData,
    claimNumber,
    setClaimNumber,
    repairs,
    setRepairs,
    parts,
    setParts,
    discounts,
    setDiscounts,
    errors,
    setErrors,
    isReadOnly
  } = useInvoiceFormData();

  const {
    validateForm,
    handleChange,
    handleClaimNumberChange
  } = useInvoiceFormHandlers({
    formData,
    claimNumber,
    isReadOnly,
    errors,
    setFormData,
    setClaimNumber,
    setErrors
  });

  const { prepareSubmitData } = useInvoiceDataPreparation({
    formData,
    claimNumber,
    repairs,
    parts,
    discounts
  });

  useInvoiceFormInitialization({
    invoice,
    setFormData,
    setClaimNumber,
    setRepairs,
    setParts,
    setDiscounts
  });

  // Log formData changes
  useEffect(() => {
    console.log('FormData updated:', formData);
  }, [formData]);

  return {
    formData,
    claimNumber,
    repairs,
    parts,
    discounts,
    errors,
    isReadOnly,
    setRepairs,
    setParts,
    setDiscounts,
    handleChange,
    handleClaimNumberChange,
    validateForm,
    calculateGlobalTotals: () => calculateGlobalTotals(repairs, parts, discounts),
    prepareSubmitData
  };
};
