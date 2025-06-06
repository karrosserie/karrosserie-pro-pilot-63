
import { CessionFormData } from '../types';
import { Cession } from '@/services/supabase/cessions';

export const getInitialFormData = (): CessionFormData => ({
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

export const mapCessionToFormData = (cession: Cession): CessionFormData => {
  console.log('Loading existing cession data:', cession);
  return {
    repair_order_id: (cession as any).repair_order_id || null,
    bank_account_id: (cession as any).bank_account_id || null,
    incident_number: (cession as any).incident_number || '',
    incident_date: (cession as any).incident_date || new Date().toISOString().split('T')[0],
    policy_number: (cession as any).policy_number || '',
    report_number: (cession as any).report_number || '',
    expert_name: (cession as any).expert_name || '',
    insurance_company_id: (cession as any).insurance_company_id || null,
    status: (cession.status as any) || 'en_attente'
  };
};

export const prepareSubmitData = (formData: CessionFormData): Partial<Cession> => {
  console.log('Preparing submit data...');
  const submitData = {
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
  
  console.log('Submit data prepared:', submitData);
  return submitData;
};
