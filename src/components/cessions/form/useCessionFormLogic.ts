
import { useState, useEffect } from 'react';
import { Cession } from '@/services/supabase/cessions';
import { CessionFormData, CessionFormErrors } from './types';

interface UseCessionFormLogicProps {
  cession?: Cession | null;
}

export const useCessionFormLogic = ({ cession }: UseCessionFormLogicProps) => {
  const [formData, setFormData] = useState<CessionFormData>({
    repair_order_id: null,
    bank_account_id: null,
    incident_number: '',
    incident_date: new Date().toISOString().split('T')[0],
    policy_number: '',
    report_number: '',
    expert_name: '',
    insurance_company_id: null,
    status: 'en_attente'
  });

  const [errors, setErrors] = useState<CessionFormErrors>({});

  // Determiner si c'est en lecture seule
  const isReadOnly = cession?.status === 'payee';

  useEffect(() => {
    if (cession) {
      setFormData({
        repair_order_id: (cession as any).repair_order_id || null,
        bank_account_id: (cession as any).bank_account_id || null,
        incident_number: (cession as any).incident_number || '',
        incident_date: (cession as any).incident_date || new Date().toISOString().split('T')[0],
        policy_number: (cession as any).policy_number || '',
        report_number: (cession as any).report_number || '',
        expert_name: (cession as any).expert_name || '',
        insurance_company_id: (cession as any).insurance_company_id || null,
        status: (cession.status as any) || 'en_attente'
      });
    }
  }, [cession]);

  const handleChange = (field: keyof CessionFormData, value: any) => {
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
    const newErrors: CessionFormErrors = {};

    if (!formData.repair_order_id) {
      newErrors.repair_order_id = 'L\'ordre de réparation est obligatoire';
    }

    if (!formData.bank_account_id) {
      newErrors.bank_account_id = 'Le compte bancaire est obligatoire';
    }

    if (!formData.incident_number.trim()) {
      newErrors.incident_number = 'Le numéro de sinistre est obligatoire';
    }

    if (!formData.incident_date) {
      newErrors.incident_date = 'La date du sinistre est obligatoire';
    }

    if (!formData.policy_number.trim()) {
      newErrors.policy_number = 'Le numéro de police est obligatoire';
    }

    if (!formData.report_number.trim()) {
      newErrors.report_number = 'Le numéro de rapport est obligatoire';
    }

    if (!formData.expert_name.trim()) {
      newErrors.expert_name = 'Le nom de l\'expert est obligatoire';
    }

    if (!formData.insurance_company_id) {
      newErrors.insurance_company_id = 'L\'assurance est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareSubmitData = (): Partial<Cession> => {
    return {
      repair_order_id: formData.repair_order_id,
      bank_account_id: formData.bank_account_id,
      incident_number: formData.incident_number,
      incident_date: formData.incident_date,
      policy_number: formData.policy_number,
      report_number: formData.report_number,
      expert_name: formData.expert_name,
      insurance_company_id: formData.insurance_company_id,
      status: formData.status
    } as any;
  };

  return {
    formData,
    errors,
    isReadOnly,
    handleChange,
    validateForm,
    prepareSubmitData
  };
};
