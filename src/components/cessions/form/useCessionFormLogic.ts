import { useState, useEffect } from 'react';
import { Cession } from '@/services/supabase/cessions';
import { CessionFormData, CessionFormErrors, CessionType } from './types';
import { useRepairOrder } from '@/hooks/use-repair-order';
import { useClient } from '@/hooks/use-clients';
import { useClientVehicles } from '@/hooks/use-vehicles';
import { useAccounts } from '@/hooks/use-accounts';
import { useFleetReservation } from '@/hooks/use-fleet-reservations';
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

  // Get repair order data when one is selected (for repair type)
  const { order, isLoading: isLoadingOrder } = useRepairOrder(
    formData.cession_type === 'repair' ? (formData.repair_order_id || undefined) : undefined
  );
  const { client, isLoading: isLoadingClient } = useClient(order?.client_id || undefined);
  const { vehicles, isLoading: isLoadingVehicles } = useClientVehicles(order?.client_id || undefined);
  const { accounts: bankAccounts, isLoading: isLoadingBankAccounts } = useAccounts();

  // Get fleet reservation data when one is selected (for fleet_loan type)
  const { reservation: fleetReservation, isLoading: isLoadingReservation } = useFleetReservation(
    formData.cession_type === 'fleet_loan' ? (formData.fleet_reservation_id || undefined) : undefined
  );

  // Find the specific vehicle for this repair order
  const repairOrderVehicle = vehicles?.find(v => v.id === order?.vehicle_id);

  // Determiner si c'est en lecture seule (check for payee status instead)
  const isReadOnly = cession?.status === 'payee';

  useEffect(() => {
    if (cession) {
      setFormData(mapCessionToFormData(cession));
    }
  }, [cession]);

  // Auto-select first bank account for new cessions
  useEffect(() => {
    if (!cession && !isLoadingBankAccounts && bankAccounts && bankAccounts.length > 0 && !formData.bank_account_id) {
      setFormData(prev => ({
        ...prev,
        bank_account_id: bankAccounts[0].id
      }));
    }
  }, [cession, bankAccounts, isLoadingBankAccounts, formData.bank_account_id]);

  // Pre-fill form with fleet reservation data
  useEffect(() => {
    if (formData.cession_type === 'fleet_loan' && fleetReservation && !cession) {
      console.log('Pre-filling form with fleet reservation data:', fleetReservation);
      
      // Calculate loan amount from quote
      let loanAmount = formData.loan_amount;
      if (fleetReservation.quotes?.amount) {
        loanAmount = fleetReservation.quotes.amount;
      }

      setFormData(prev => ({
        ...prev,
        incident_number: fleetReservation.claim_number || prev.incident_number,
        policy_number: fleetReservation.insurance_contract_number || prev.policy_number,
        loan_amount: loanAmount,
        // Clear repair-specific fields
        report_number: '',
        expert_name: ''
      }));
      
      setValidationErrorMessage(null);
      setValidationBlocked(false);
    }
  }, [formData.cession_type, fleetReservation, cession]);

  // Effect to validate repair order data and pre-fill form when all data is loaded
  // Only for new cessions (not when editing existing ones)
  useEffect(() => {
    // Ne faire la validation que pour les nouvelles cessions de type repair
    if (!cession && formData.cession_type === 'repair' && formData.repair_order_id && !isLoadingOrder && !isLoadingClient && !isLoadingVehicles) {
      console.log('Validating repair order data for new cession:', {
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
        
        // Pre-fill form with repair order data
        if (order) {
          setFormData(prev => ({
            ...prev,
            incident_number: order.claim_number || prev.incident_number,
            incident_date: order.incident_date || prev.incident_date,
            policy_number: order.policy_number || prev.policy_number,
            report_number: order.report_number || prev.report_number,
            expert_name: order.expert_name || prev.expert_name
          }));
        }
      }
    } else if (!formData.repair_order_id && formData.cession_type === 'repair' && !cession) {
      // Clear errors and unblock validation when no repair order is selected (only for new cessions)
      setValidationErrorMessage(null);
      setValidationBlocked(false);
    }
  }, [formData.repair_order_id, formData.cession_type, order, client, repairOrderVehicle, isLoadingOrder, isLoadingClient, isLoadingVehicles, cession]);

  const handleChange = (field: keyof CessionFormData, value: any) => {
    console.log(`Field changed: ${field} = ${value}`);
    
    // Reset related fields when changing cession type
    if (field === 'cession_type') {
      setFormData(prev => ({
        ...prev,
        cession_type: value as CessionType,
        repair_order_id: null,
        fleet_reservation_id: null,
        loan_amount: null,
        // Reset form fields that will be pre-filled
        incident_number: '',
        policy_number: '',
        report_number: '',
        expert_name: ''
      }));
      setValidationErrorMessage(null);
      setValidationBlocked(false);
      return;
    }
    
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
    client: formData.cession_type === 'repair' ? client : fleetReservation?.clients,
    repairOrder: order,
    fleetReservation,
    handleChange,
    validateForm,
    prepareSubmitData: () => prepareSubmitData(formData),
    clearValidationError
  };
};
