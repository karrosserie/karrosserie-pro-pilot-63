
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
    brand_id: string;
    model_id: string;
    car_brands?: {
      id: string;
      name: string;
    } | null;
    car_models?: {
      id: string;
      name: string;
    } | null;
  } | null;
  quotes?: {
    id: string;
    reference: string;
    amount: number;
  } | null;
  invoices?: {
    id: string;
    reference: string;
  }[] | null;
  signature_date?: string | null;
  claim_number?: string | null;
  report_number?: string | null;
  policy_number?: string | null;
  report_date?: string | null;
  expert_name?: string | null;
  incident_date?: string | null;
  personal_items?: string | null;
  oodrive_contract_id?: string | null;
  signed_document_url?: string | null;
};

export type NewRepairOrder = Database['public']['Tables']['repair_orders']['Insert'];
export type UpdateRepairOrder = Database['public']['Tables']['repair_orders']['Update'];
