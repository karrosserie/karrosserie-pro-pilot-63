
import type { Database } from '@/integrations/supabase/types';

// Base expense type from Supabase
type ExpenseRow = Database['public']['Tables']['expenses']['Row'];
type ExpenseInsert = Database['public']['Tables']['expenses']['Insert'];
type ExpenseUpdate = Database['public']['Tables']['expenses']['Update'];

// Extended expense type with joins
export interface ExpenseWithRelations extends ExpenseRow {
  vehicle?: {
    id: string;
    license_plate: string;
    brand: string;
    model: string;
  } | null;
}

export type NewExpense = Omit<ExpenseInsert, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type UpdateExpense = ExpenseUpdate;
