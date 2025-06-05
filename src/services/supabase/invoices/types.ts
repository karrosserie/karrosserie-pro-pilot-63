
import type { Database } from '@/integrations/supabase/types';

// Base invoice type from Supabase
type InvoiceRow = Database['public']['Tables']['invoices']['Row'];
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
type InvoiceUpdate = Database['public']['Tables']['invoices']['Update'];

// Extended invoice type with joins
export interface Invoice extends InvoiceRow {
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

export interface NewInvoice extends Omit<InvoiceInsert, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdateInvoice extends InvoiceUpdate {}
