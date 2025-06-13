
import { useEffect } from 'react';
import { Invoice } from '@/services/supabase/invoices';
import { useInvoiceFormState } from './hooks/useInvoiceFormState';
import { useInvoiceCalculations } from './hooks/useInvoiceCalculations';
import { useInvoiceValidation } from './hooks/useInvoiceValidation';
import { generateNextInvoiceNumber, prepareSubmitData, parseInvoiceNotes } from './utils/invoiceFormUtils';

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
  } = useInvoiceFormState({ invoice });

  const { calculateGlobalTotals } = useInvoiceCalculations();
  const { validateForm } = useInvoiceValidation();

  const handleChange = (field: string, value: any) => {
    console.log('handleChange called with:', { field, value, isReadOnly });
    
    if (isReadOnly && field !== 'payment_method' && field !== 'payment_date') {
      console.log('Blocked change due to readonly mode');
      return;
    }
    
    if (field === 'description') {
      setDescription(value);
    } else {
      console.log('Updating formData:', field, value);
      setFormData(prev => {
        const newData = { ...prev, [field]: value };
        console.log('New formData after update:', newData);
        return newData;
      });
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClaimNumberChange = (value: string) => {
    if (!isReadOnly) {
      setClaimNumber(value);
      console.log('Claim number changed to:', value);
      if (errors.claim_number) {
        setErrors(prev => ({ ...prev, claim_number: '' }));
      }
    }
  };

  const handleCurrentMileageChange = (value: string) => {
    if (!isReadOnly) {
      setCurrentMileage(value);
      console.log('Current mileage changed to:', value);
      if (errors.current_mileage) {
        setErrors(prev => ({ ...prev, current_mileage: '' }));
      }
    }
  };

  const validateFormData = () => {
    return validateForm(formData, claimNumber, currentMileage, setErrors);
  };

  const calculateTotals = () => {
    return calculateGlobalTotals(repairs, parts, discounts);
  };

  const prepareFormSubmitData = () => {
    return prepareSubmitData(formData, description, claimNumber, currentMileage, repairs, parts, discounts);
  };

  useEffect(() => {
    if (invoice) {
      setFormData({
        reference: invoice.reference,
        client_id: invoice.client_id,
        vehicle_id: invoice.vehicle_id,
        status: invoice.status || 'En attente de paiement',
        due_date: invoice.due_date,
        payment_method: invoice.payment_method,
        payment_date: invoice.payment_date,
        notes: invoice.notes || ''
      });
      
      if (invoice.notes) {
        const parsedData = parseInvoiceNotes(invoice.notes);
        setDescription(parsedData.description);
        setClaimNumber(parsedData.claimNumber);
        setCurrentMileage(parsedData.currentMileage);
        setRepairs(parsedData.repairs);
        setParts(parsedData.parts);
        setDiscounts(parsedData.discounts);
      } else {
        setDescription('');
        setClaimNumber('');
        setCurrentMileage('');
        setRepairs([]);
        setParts([]);
        setDiscounts([]);
      }
    } else {
      // Initialiser avec la date d'aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      
      generateNextInvoiceNumber().then(nextNumber => {
        setFormData(prev => ({
          ...prev,
          reference: nextNumber,
          status: 'En attente de paiement',
          due_date: today // Utiliser la date d'aujourd'hui
        }));
      });
      setDescription('');
      setClaimNumber('');
      setCurrentMileage('');
    }
  }, [invoice]);

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
    validateForm: validateFormData,
    calculateGlobalTotals: calculateTotals,
    prepareSubmitData: prepareFormSubmitData
  };
};
