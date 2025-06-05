
import type { Database } from '@/integrations/supabase/types';

// Base receipt type from Supabase
type ReceiptRow = Database['public']['Tables']['receipts']['Row'];
type ReceiptInsert = Database['public']['Tables']['receipts']['Insert'];
type ReceiptUpdate = Database['public']['Tables']['receipts']['Update'];

// Extended receipt type with joins
export interface Receipt extends ReceiptRow {
  invoices?: {
    id: string;
    reference: string;
    amount: number;
    client_id: string;
  } | null;
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

export interface NewReceipt extends Omit<ReceiptInsert, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdateReceipt extends ReceiptUpdate {}

export interface ReceiptWithClient extends Receipt {
  client?: string;
  invoice?: string;
}
