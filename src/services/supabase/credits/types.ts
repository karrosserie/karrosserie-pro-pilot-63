
export interface Credit {
  id: string;
  company_id: string;
  reference: string;
  client_id: string | null;
  vehicle_id: string | null;
  invoice_id: string | null;
  status: string;
  amount: number;
  items_data: string | null;
  notes: string | null;
  created_date: string | null;
  archived: boolean;
  is_franchise_credit: boolean;
  created_at: string;
  updated_at: string;
  // Relations (optionnelles, ajoutées par les joins)
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  vehicles?: {
    id: string;
    brand: string;
    model: string;
    license_plate: string;
  } | null;
  invoices?: {
    id: string;
    reference: string;
  } | null;
}

export interface CreditInsert {
  company_id: string;
  reference: string;
  client_id?: string | null;
  vehicle_id?: string | null;
  invoice_id?: string | null;
  status: string;
  amount: number;
  items_data?: string | null;
  notes?: string | null;
}

export interface CreditUpdate {
  reference?: string;
  client_id?: string | null;
  vehicle_id?: string | null;
  invoice_id?: string | null;
  status?: string;
  amount?: number;
  items_data?: string | null;
  notes?: string | null;
}

export interface CreditCreateData {
  reference: string;
  invoice_id: string | null;
  status: string;
  amount: number;
  items_data: string;
  notes?: string;
  is_franchise_credit?: boolean;
}

export interface CreditUpdateData {
  reference?: string;
  invoice_id?: string | null;
  status?: string;
  amount?: number;
  items_data?: string;
  notes?: string;
  is_franchise_credit?: boolean;
}
