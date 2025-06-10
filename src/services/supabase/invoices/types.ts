
import type { Database } from '@/integrations/supabase/types';

// Base invoice type from Supabase
type InvoiceRow = Database['public']['Tables']['invoices']['Row'];
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
type InvoiceUpdate = Database['public']['Tables']['invoices']['Update'];

// Extended invoice type with joins and additional fields
export interface Invoice extends InvoiceRow {
  // Additional fields not in the database but used in the UI
  payment_details?: string | null;
  payment_due_date?: string | null;
  
  // Joined data
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
  repair_orders?: {
    id: string;
    reference: string;
  } | null;
}

export interface NewInvoice extends Omit<InvoiceInsert, 'id' | 'created_at' | 'updated_at'> {
  payment_details?: string | null;
  payment_due_date?: string | null;
}

export interface UpdateInvoice extends InvoiceUpdate {
  payment_details?: string | null;
  payment_due_date?: string | null;
}
