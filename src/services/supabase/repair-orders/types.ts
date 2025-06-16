
import { Database } from '@/integrations/supabase/types';

export type RepairOrder = Database['public']['Tables']['repair_orders']['Row'] & {
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
  } | null;
  vehicles?: {
    id: string;
    license_plate: string;
    brand: string;
    model: string;
    car_brands?: {
      id: string;
      name: string;
    };
    car_models?: {
      id: string;
      name: string;
    };
  } | null;
  quotes?: {
    id: string;
    reference: string;
    amount: number;
  } | null;
  repairs_data?: string | null;
  parts_data?: string | null;
  discounts_data?: string | null;
  client_signature?: string | null;
  client_name_signature?: string | null;
  signature_date?: string | null;
  description?: string | null;
  current_mileage?: string | null;
  claim_number?: string | null;
};

export type NewRepairOrder = Database['public']['Tables']['repair_orders']['Insert'];
export type UpdateRepairOrder = Database['public']['Tables']['repair_orders']['Update'];
