
export interface Credit {
  id: string;
  user_id: string;
  reference: string;
  client_id: string | null;
  vehicle_id: string | null;
  invoice_id: string | null;
  status: string;
  amount: number;
  items_data: any | null; // Changed from string to any to accept Json from Supabase
  notes: string | null;
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
  user_id: string;
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
}

export interface CreditUpdateData {
  reference?: string;
  invoice_id?: string | null;
  status?: string;
  amount?: number;
  items_data?: string;
  notes?: string;
}
