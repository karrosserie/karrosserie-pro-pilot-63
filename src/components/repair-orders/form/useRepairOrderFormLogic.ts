
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
  } = useFormState();

  const { calculateGlobalTotals } = useCalculations(repairs, parts, discounts);
  const { prepareSubmitData, generateNextOrderNumber, parseOrderData } = useDataPreparation();
  const { validateForm, clearFieldError } = useFormValidation(formData, claimNumber, setErrors);
  const { handleChange, handleClaimNumberChange } = useFormHandlers(
    isReadOnly,
    setFormData,
    setClaimNumber,
    clearFieldError,
    errors
  );

  const prepareSubmitDataWrapper = () => {
    return prepareSubmitData(formData, claimNumber, repairs, parts, discounts);
  };

  useEffect(() => {
    // Vérifier si c'est un ordre existant (avec un ID) ou une création avec pré-remplissage
    const isExistingOrder = order && order.id;
    
    if (isExistingOrder) {
      console.log('Loading existing order data:', order);
      
      // Charger toutes les données de l'ordre en une seule fois
      const initialData = {
        reference: order.reference || '',
        client_id: order.client_id || null,
        vehicle_id: order.vehicle_id || null,
        status: order.status || 'En cours',
        notes: order.notes || '',
        report_number: order.report_number || '',
        policy_number: order.policy_number || '',
        report_date: order.report_date || '',
        expert_name: order.expert_name || '',
        incident_date: order.incident_date || ''
      };
      
      console.log('Setting form data with vehicle_id:', initialData.vehicle_id);
      setFormData(initialData);
      
      if (!order.vehicle_id) {
        console.warn('Warning: vehicle_id is not defined in the order data');
      }
      
      // Charger les données depuis les champs séparés
      const orderData = parseOrderData(order);
      setClaimNumber(orderData.claimNumber || '');
      setRepairs(orderData.repairs || []);
      setParts(orderData.parts || []);
      setDiscounts(orderData.discounts || []);
      
      console.log('Form data initialized:', {
        reference: order.reference,
        client_id: order.client_id,
        vehicle_id: order.vehicle_id,
        status: order.status || 'En cours'
      });
    } else {
      // Nouvel ordre ou ordre avec pré-remplissage (sans ID)
      const today = new Date().toISOString().split('T')[0];
      
      generateNextOrderNumber().then(nextNumber => {
        setFormData(prev => ({
          ...prev,
          reference: nextNumber,
          // Appliquer les données de pré-remplissage si disponibles
          ...(order && {
            client_id: order.client_id || null,
            vehicle_id: order.vehicle_id || null,
            status: order.status || 'En cours',
            notes: order.notes || '',
            report_number: order.report_number || '',
            policy_number: order.policy_number || '',
            report_date: order.report_date || '',
            expert_name: order.expert_name || '',
            incident_date: order.incident_date || ''
          })
        }));
      });
      
      // Si on a des données de pré-remplissage (comme d'un devis converti)
      if (order) {
        const orderData = parseOrderData(order);
        setClaimNumber(orderData.claimNumber || '');
        setRepairs(orderData.repairs || []);
        setParts(orderData.parts || []);
        setDiscounts(orderData.discounts || []);
      } else {
        setClaimNumber('');
        setRepairs([]);
        setParts([]);
        setDiscounts([]);
      }
    }
  }, [order]);

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
    calculateGlobalTotals,
    prepareSubmitData: prepareSubmitDataWrapper
  };
};
