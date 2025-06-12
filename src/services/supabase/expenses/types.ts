
import { Database } from '@/integrations/supabase/types';

export type Expense = Database['public']['Tables']['expenses']['Row'];

export type ExpenseWithRelations = Expense & {
  vehicle?: {
    id: string;
    license_plate: string;
    car_brands: { id: string; name: string } | null;
    car_models: { id: string; name: string } | null;
  } | null;
};
