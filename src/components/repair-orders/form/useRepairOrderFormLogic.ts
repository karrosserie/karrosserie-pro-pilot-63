
import { useEffect } from 'react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { UseRepairOrderFormLogicProps } from './hooks/types';
import { useFormState } from './hooks/useFormState';
import { useCalculations } from './hooks/useCalculations';
import { useDataPreparation } from './hooks/useDataPreparation';
import { useFormValidation } from './hooks/useFormValidation';
import { useFormHandlers } from './hooks/useFormHandlers';

export const useRepairOrderFormLogic = ({ order }: UseRepairOrderFormLogicProps) => {
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
  } = useFormState();

  const { calculateGlobalTotals } = useCalculations(repairs, parts, discounts);
  const { prepareSubmitData, generateNextOrderNumber, parseOrderNotes } = useDataPreparation();
  const { validateForm, clearFieldError } = useFormValidation(formData, claimNumber, currentMileage, setErrors);
  const { handleChange, handleClaimNumberChange, handleCurrentMileageChange } = useFormHandlers(
    isReadOnly,
    setFormData,
    setDescription,
    setClaimNumber,
    setCurrentMileage,
    clearFieldError,
    errors
  );

  const prepareSubmitDataWrapper = () => {
    return prepareSubmitData(formData, description, claimNumber, currentMileage, repairs, parts, discounts);
  };

  useEffect(() => {
    if (order) {
      console.log('Loading order data:', order);
      
      const initialData = {
        reference: order.reference || '',
        client_id: order.client_id || null,
        vehicle_id: order.vehicle_id || null,
        status: order.status || 'En cours',
        start_date: order.start_date || null,
        end_date: order.end_date || null,
        estimated_hours: order.estimated_hours || null,
        notes: order.notes || ''
      };
      
      setFormData(initialData);
      
      if (!order.vehicle_id) {
        console.warn('Warning: vehicle_id is not defined in the order data');
      }
      
      if (order.notes) {
        const noteData = parseOrderNotes(order.notes);
        setDescription(noteData.description || '');
        setClaimNumber(noteData.claimNumber || '');
        setCurrentMileage(noteData.currentMileage || '');
        if (noteData.repairs) setRepairs(noteData.repairs);
        if (noteData.parts) setParts(noteData.parts);
        if (noteData.discounts) setDiscounts(noteData.discounts);
      } else {
        setDescription('');
        setClaimNumber('');
        setCurrentMileage('');
        setRepairs([]);
        setParts([]);
        setDiscounts([]);
      }
      
      console.log('Form data set to:', {
        reference: order.reference,
        client_id: order.client_id,
        vehicle_id: order.vehicle_id,
        status: order.status || 'En cours'
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      
      generateNextOrderNumber().then(nextNumber => {
        setFormData(prev => ({
          ...prev,
          reference: nextNumber,
          start_date: today
        }));
      });
      setDescription('');
      setClaimNumber('');
      setCurrentMileage('');
    }
  }, [order]);

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
    calculateGlobalTotals,
    prepareSubmitData: prepareSubmitDataWrapper
  };
};
