
export interface CessionFormData {
  repair_order_id: string | null;
  bank_account_id: string | null;
  incident_number: string;
  incident_date: string;
  policy_number: string;
  report_number: string;
  expert_name: string;
  insurance_company_id: string | null;
  status: 'en_attente' | 'envoyee' | 'signee' | 'payee';
}

export interface CessionFormErrors {
  repair_order_id?: string;
  bank_account_id?: string;
  incident_number?: string;
  incident_date?: string;
  policy_number?: string;
  report_number?: string;
  expert_name?: string;
  insurance_company_id?: string;
  status?: string;
}
