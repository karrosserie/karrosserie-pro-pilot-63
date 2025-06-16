
export interface Cession {
  id: string;
  reference: string;
  status: 'en_attente' | 'en_attente_signature' | 'signee' | 'signature_refusee' | 'lettre_recommandee_envoyee' | 'lettre_recommandee_recue' | 'lettre_recommandee_non_recuperee' | 'lettre_recommandee_refusee' | 'lettre_recommandee_presentee' | 'payee';
  user_id: string;
  
  // New required fields for cession form
  repair_order_id: string | null;
  bank_account_id: string | null;
  incident_number: string | null;
  incident_date: string | null;
  policy_number: string | null;
  report_number: string | null;
  expert_name: string | null;
  insurance_company_id: string | null;
  
  // Legacy fields (for backward compatibility)
  buyer_name: string | null;
  buyer_contact: string | null;
  sale_price: number | null;
  sale_date: string | null;
  notes: string | null;
  document_url: string | null;
  
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
    clients: { first_name: string; last_name: string; } | null;
    vehicles: {
      license_plate: string;
      car_brands: { name: string; } | null;
      car_models: { name: string; } | null;
    } | null;
  } | null;
}

export interface NewCession {
  reference?: string;
  status?: 'en_attente' | 'en_attente_signature' | 'signee' | 'signature_refusee' | 'lettre_recommandee_envoyee' | 'lettre_recommandee_recue' | 'lettre_recommandee_non_recuperee' | 'lettre_recommandee_refusee' | 'lettre_recommandee_presentee' | 'payee';
  
  // New required fields for cession form
  repair_order_id?: string | null;
  bank_account_id?: string | null;
  incident_number?: string | null;
  incident_date?: string | null;
  policy_number?: string | null;
  report_number?: string | null;
  expert_name?: string | null;
  insurance_company_id?: string | null;
  
  // Legacy fields (for backward compatibility)
  buyer_name?: string | null;
  buyer_contact?: string | null;
  sale_price?: number | null;
  sale_date?: string | null;
  notes?: string | null;
  document_url?: string | null;
}

export interface UpdateCession {
  reference?: string;
  status?: 'en_attente' | 'en_attente_signature' | 'signee' | 'signature_refusee' | 'lettre_recommandee_envoyee' | 'lettre_recommandee_recue' | 'lettre_recommandee_non_recuperee' | 'lettre_recommandee_refusee' | 'lettre_recommandee_presentee' | 'payee';
  
  // New required fields for cession form
  repair_order_id?: string | null;
  bank_account_id?: string | null;
  incident_number?: string | null;
  incident_date?: string | null;
  policy_number?: string | null;
  report_number?: string | null;
  expert_name?: string | null;
  insurance_company_id?: string | null;
  
  // Legacy fields (for backward compatibility)  
  buyer_name?: string | null;
  buyer_contact?: string | null;
  sale_price?: number | null;
  sale_date?: string | null;
  notes?: string | null;
  document_url?: string | null;
}
