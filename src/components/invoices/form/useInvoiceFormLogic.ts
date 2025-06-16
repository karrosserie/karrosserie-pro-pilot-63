
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
    description,
    setDescription,
    claimNumber,
    setClaimNumber,
    currentMileage,
    setCurrentMileage,
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
    handleClaimNumberChange,
    handleCurrentMileageChange
  } = useInvoiceFormHandlers({
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
  });

  const { prepareSubmitData } = useInvoiceDataPreparation({
    formData,
    description,
    claimNumber,
    currentMileage,
    repairs,
    parts,
    discounts
  });

  useInvoiceFormInitialization({
    invoice,
    setFormData,
    setDescription,
    setClaimNumber,
    setCurrentMileage,
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
    description,
    claimNumber,
    currentMileage,
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
    handleCurrentMileageChange,
    validateForm,
    calculateGlobalTotals: () => calculateGlobalTotals(repairs, parts, discounts),
    prepareSubmitData
  };
};
