
export type CessionType = 'repair' | 'repair_enterprise' | 'fleet_loan';

export interface Cession {
  id: string;
  reference: string;
  status: 'en_attente' | 'en_attente_signature' | 'signee' | 'signature_refusee' | 'lettre_recommandee_envoyee' | 'lettre_recommandee_recue' | 'lettre_recommandee_non_recuperee' | 'lettre_recommandee_refusee' | 'lettre_recommandee_presentee' | 'payee';
  company_id: string;
  cession_type: CessionType;
  
  // Required fields for cession form
  repair_order_id: string | null;
  fleet_reservation_id: string | null;
  bank_account_id: string | null;
  incident_number: string | null;
  incident_date: string | null;
  policy_number: string | null;
  report_number: string | null;
  expert_name: string | null;
  insurance_company_id: string | null;
  loan_amount: number | null;
  
  // Optional fields
  document_url: string | null;
  oodrive_contract_id: string | null;
  signed_document_url: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Relations
  insurance_companies?: {
    name: string;
  } | null;
  repair_orders?: {
    reference: string;
    created_at: string;
    amount: number;
    parts_data?: any | null;
    repairs_data?: any | null;
    clients: { 
      first_name: string; 
      last_name: string; 
      address: string | null;
      city: string | null;
      postal_code: string | null;
      email: string | null;
      phone: string | null;
      oodrive_recipient_id: string | null;
    } | null;
    vehicles: {
      license_plate: string;
      vin: string | null;
      mileage: number | null;
      car_brands: { name: string; } | null;
      car_models: { name: string; } | null;
    } | null;
  } | null;
  fleet_reservations?: {
    id: string;
    start_date: string;
    end_date: string | null;
    status: string;
    daily_rate: number | null;
    insurance_company_name: string | null;
    insurance_contract_number: string | null;
    insurance_email: string | null;
    claim_number: string | null;
    clients: {
      id: string;
      first_name: string;
      last_name: string;
      email: string | null;
      phone: string | null;
      address: string | null;
      city: string | null;
      postal_code: string | null;
      oodrive_recipient_id: string | null;
    } | null;
    fleet_vehicles: {
      id: string;
      license_plate: string;
      brand: string | null;
      model: string | null;
    } | null;
    quotes?: {
      id: string;
      amount: number;
    } | null;
  } | null;
  bank_accounts?: {
    bank: string;
    iban: string;
    bic: string;
  } | null;
}

export interface NewCession {
  reference?: string;
  status?: 'en_attente' | 'en_attente_signature' | 'signee' | 'signature_refusee' | 'lettre_recommandee_envoyee' | 'lettre_recommandee_recue' | 'lettre_recommandee_non_recuperee' | 'lettre_recommandee_refusee' | 'lettre_recommandee_presentee' | 'payee';
  cession_type?: CessionType;
  
  // Required fields for cession form
  repair_order_id?: string | null;
  fleet_reservation_id?: string | null;
  bank_account_id?: string | null;
  incident_number?: string | null;
  incident_date?: string | null;
  policy_number?: string | null;
  report_number?: string | null;
  expert_name?: string | null;
  insurance_company_id?: string | null;
  loan_amount?: number | null;
  
  // Optional fields
  document_url?: string | null;
  oodrive_contract_id?: string | null;
  signed_document_url?: string | null;
}

export interface UpdateCession {
  reference?: string;
  status?: 'en_attente' | 'en_attente_signature' | 'signee' | 'signature_refusee' | 'lettre_recommandee_envoyee' | 'lettre_recommandee_recue' | 'lettre_recommandee_non_recuperee' | 'lettre_recommandee_refusee' | 'lettre_recommandee_presentee' | 'payee';
  cession_type?: CessionType;
  
  // Required fields for cession form
  repair_order_id?: string | null;
  fleet_reservation_id?: string | null;
  bank_account_id?: string | null;
  incident_number?: string | null;
  incident_date?: string | null;
  policy_number?: string | null;
  report_number?: string | null;
  expert_name?: string | null;
  insurance_company_id?: string | null;
  loan_amount?: number | null;
  
  // Optional fields
  document_url?: string | null;
  oodrive_contract_id?: string | null;
  signed_document_url?: string | null;
}
