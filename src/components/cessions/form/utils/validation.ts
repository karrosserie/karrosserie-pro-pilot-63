
import { CessionFormData, CessionFormErrors } from '../types';

export const validateCessionForm = (formData: CessionFormData): { errors: CessionFormErrors; isValid: boolean } => {
  console.log('Starting form validation...');
  console.log('Current form data:', formData);

  const newErrors: CessionFormErrors = {};

  // Validation based on cession type
  if (formData.cession_type === 'repair') {
    if (!formData.repair_order_id) {
      console.log('Missing repair_order_id');
      newErrors.repair_order_id = 'L\'ordre de réparation est obligatoire';
    }
  } else if (formData.cession_type === 'fleet_loan') {
    if (!formData.fleet_reservation_id) {
      console.log('Missing fleet_reservation_id');
      newErrors.fleet_reservation_id = 'Le prêt de véhicule est obligatoire';
    }
    if (!formData.loan_amount || formData.loan_amount <= 0) {
      console.log('Missing or invalid loan_amount');
      newErrors.loan_amount = 'Le montant du prêt est obligatoire';
    }
  }

  if (!formData.bank_account_id) {
    console.log('Missing bank_account_id');
    newErrors.bank_account_id = 'Le compte bancaire est obligatoire';
  }

  if (!formData.incident_number.trim()) {
    console.log('Missing incident_number');
    newErrors.incident_number = 'Le numéro de sinistre est obligatoire';
  }

  if (!formData.incident_date) {
    console.log('Missing incident_date');
    newErrors.incident_date = 'La date du sinistre est obligatoire';
  }

  if (!formData.policy_number.trim()) {
    console.log('Missing policy_number');
    newErrors.policy_number = 'Le numéro de police est obligatoire';
  }

  // report_number et expert_name optionnels pour les prêts
  if (formData.cession_type === 'repair') {
    if (!formData.report_number.trim()) {
      console.log('Missing report_number');
      newErrors.report_number = 'Le numéro de rapport est obligatoire';
    }

    if (!formData.expert_name.trim()) {
      console.log('Missing expert_name');
      newErrors.expert_name = 'Le nom de l\'expert est obligatoire';
    }
  }

  if (!formData.insurance_company_id) {
    console.log('Missing insurance_company_id');
    newErrors.insurance_company_id = 'L\'assurance est obligatoire';
  }

  console.log('Validation errors found:', newErrors);
  const isValid = Object.keys(newErrors).length === 0;
  console.log('Form is valid:', isValid);
  
  return { errors: newErrors, isValid };
};
