import { useMemo } from 'react';
import { Invoice } from '@/services/supabase/invoices';
import { calculateGlobalTotals } from './hooks/useInvoiceCalculations';
import { useInvoiceFormData } from './hooks/useInvoiceFormData';
import { useInvoiceFormHandlers } from './hooks/useInvoiceFormHandlers';
import { useInvoiceDataPreparation } from './hooks/useInvoiceDataPreparation';
import { useInvoiceFormInitialization } from './hooks/useInvoiceFormInitialization';

interface UseInvoiceFormLogicProps {
  invoice?: Invoice | null;
  prefillData?: any;
}

export const useInvoiceFormLogic = ({ invoice, prefillData }: UseInvoiceFormLogicProps) => {
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
    isReadOnly,
    skipVehicle,
    setSkipVehicle
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
    skipVehicle,
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
    prefillData,
    setFormData,
    setClaimNumber,
    setRepairs,
    setParts,
    setDiscounts
  });

  // Memoize global totals to prevent recalculation on every render
  const globalTotals = useMemo(() => 
    calculateGlobalTotals(repairs, parts, discounts),
    [repairs, parts, discounts]
  );

  return {
    formData,
    claimNumber,
    repairs,
    parts,
    discounts,
    errors,
    isReadOnly,
    skipVehicle,
    setSkipVehicle,
    setRepairs,
    setParts,
    setDiscounts,
    handleChange,
    handleClaimNumberChange,
    validateForm,
    globalTotals,
    prepareSubmitData
  };
};
