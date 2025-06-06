
import { Database } from '@/integrations/supabase/types';

export type Expense = Database['public']['Tables']['expenses']['Row'];
export type NewExpense = Database['public']['Tables']['expenses']['Insert'];
export type UpdateExpense = Database['public']['Tables']['expenses']['Update'];

export interface ExpenseWithRelations extends Expense {
  status: string;
  vehicle?: {
    id: string;
    license_plate: string;
    brand: string;
    model: string;
  } | null;
}
