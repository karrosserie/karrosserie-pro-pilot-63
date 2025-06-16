import { useState, useEffect } from 'react';
import { Cession } from '@/services/supabase/cessions';
import { CessionFormData, CessionFormErrors } from './types';
import { useRepairOrder } from '@/hooks/use-repair-order';
import { useClient } from '@/hooks/use-clients';
import { useClientVehicles } from '@/hooks/use-vehicles';
import { validateCessionForm } from './utils/validation';
import { validateRepairOrderData } from './utils/dataValidation';
import { getInitialFormData, mapCessionToFormData, prepareSubmitData } from './utils/formState';

interface UseCessionFormLogicProps {
  cession?: Cession | null;
}

export const useCessionFormLogic = ({ cession }: UseCessionFormLogicProps) => {
  const [formData, setFormData] = useState<CessionFormData>(getInitialFormData());
  const [errors, setErrors] = useState<CessionFormErrors>({});
  const [validationBlocked, setValidationBlocked] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState<string | null>(null);

  // Get repair order data when one is selected
  const { order, isLoading: isLoadingOrder } = useRepairOrder(formData.repair_order_id || undefined);
  const { client, isLoading: isLoadingClient } = useClient(order?.client_id || undefined);
  const { vehicles, isLoading: isLoadingVehicles } = useClientVehicles(order?.client_id || undefined);

  // Find the specific vehicle for this repair order
  const repairOrderVehicle = vehicles?.find(v => v.id === order?.vehicle_id);

  // Determiner si c'est en lecture seule (check for payee status instead)
  const isReadOnly = cession?.status === 'payee';

  useEffect(() => {
    if (cession) {
      setFormData(mapCessionToFormData(cession));
    }
  }, [cession]);

  // Effect to validate repair order data when all data is loaded
  useEffect(() => {
    if (formData.repair_order_id && !isLoadingOrder && !isLoadingClient && !isLoadingVehicles) {
      console.log('Validating repair order data:', {
        order,
        client,
        repairOrderVehicle,
        vehicles: vehicles?.length
      });
      
      const validationError = validateRepairOrderData(order, client, repairOrderVehicle);
      if (validationError) {
        setValidationErrorMessage(validationError);
        setValidationBlocked(true);
      } else {
        // Clear any previous errors
        setValidationErrorMessage(null);
        setValidationBlocked(false);
      }
    } else if (!formData.repair_order_id) {
      // Clear errors and unblock validation when no repair order is selected
      setValidationErrorMessage(null);
      setValidationBlocked(false);
    }
  }, [formData.repair_order_id, order, client, repairOrderVehicle, isLoadingOrder, isLoadingClient, isLoadingVehicles]);

  const handleChange = (field: keyof CessionFormData, value: any) => {
    console.log(`Field changed: ${field} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    console.log('Validation blocked:', validationBlocked);

    // Si la validation est bloquée à cause des données manquantes, empêcher la soumission
    if (validationBlocked) {
      console.log('Validation blocked due to missing data');
      return false;
    }

    const { errors: newErrors, isValid } = validateCessionForm(formData);
    setErrors(newErrors);
    
    return isValid;
  };

  const clearValidationError = () => {
    setValidationErrorMessage(null);
  };

  return {
    formData,
    errors,
    isReadOnly,
    validationBlocked,
    validationErrorMessage,
    handleChange,
    validateForm,
    prepareSubmitData: () => prepareSubmitData(formData),
    clearValidationError
  };
};
