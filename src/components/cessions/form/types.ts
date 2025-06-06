
export type CessionStatus = 
  | 'en_attente'
  | 'en_attente_signature'
  | 'signee'
  | 'signature_refusee'
  | 'lettre_recommandee_envoyee'
  | 'lettre_recommandee_recue'
  | 'lettre_recommandee_non_recuperee'
  | 'lettre_recommandee_refusee'
  | 'lettre_recommandee_presentee'
  | 'payee';

export interface CessionFormData {
  repair_order_id: string | null;
  bank_account_id: string | null;
  incident_number: string;
  incident_date: string;
  policy_number: string;
  report_number: string;
  expert_name: string;
  insurance_company_id: string | null;
  status: CessionStatus;
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
