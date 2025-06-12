
import { Database } from '@/integrations/supabase/types';

export type Invoice = Database['public']['Tables']['invoices']['Row'] & {
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  vehicles?: {
    id: string;
    license_plate: string;
    car_brands: { id: string; name: string } | null;
    car_models: { id: string; name: string } | null;
  } | null;
  repair_orders?: {
    id: string;
    reference: string;
  } | null;
};
