
export interface Cession {
  id: string;
  reference: string;
  sale_date: string;
  sale_price: number;
  buyer_name: string;
  buyer_contact: string;
  expert_name: string | null;
  expertise_date: string | null;
  expertise_amount: number | null;
  salvage_value: number | null;
  insurance_company_id: string | null;
  bank_account_id: string | null;
  repair_order_id: string | null;
  document_url: string | null;
  status: 'en_attente' | 'en_cours' | 'terminee' | 'annulee';
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  insurance_companies?: {
    name: string;
  } | null;
  vehicles?: {
    id: string;
    license_plate: string;
    car_brands: { name: string; } | null;
    car_models: { name: string; } | null;
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
  sale_date?: string;
  sale_price?: number;
  buyer_name?: string;
  buyer_contact?: string;
  expert_name?: string | null;
  expertise_date?: string | null;
  expertise_amount?: number | null;
  salvage_value?: number | null;
  insurance_company_id?: string | null;
  bank_account_id?: string | null;
  repair_order_id?: string | null;
  document_url?: string | null;
  status?: 'en_attente' | 'en_cours' | 'terminee' | 'annulee';
  notes?: string | null;
}

export interface UpdateCession {
  reference?: string;
  sale_date?: string;
  sale_price?: number;
  buyer_name?: string;
  buyer_contact?: string;
  expert_name?: string | null;
  expertise_date?: string | null;
  expertise_amount?: number | null;
  salvage_value?: number | null;
  insurance_company_id?: string | null;
  bank_account_id?: string | null;
  repair_order_id?: string | null;
  document_url?: string | null;
  status?: 'en_attente' | 'en_cours' | 'terminee' | 'annulee';
  notes?: string | null;
}
