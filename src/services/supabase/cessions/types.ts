
import { Database } from '@/integrations/supabase/types';
import { CessionStatus } from '@/components/cessions/form/types';

// Extend the base types to include the new columns
type BaseCession = Database['public']['Tables']['cessions']['Row'];
type BaseNewCession = Database['public']['Tables']['cessions']['Insert'];
type BaseUpdateCession = Database['public']['Tables']['cessions']['Update'];

export interface Cession extends BaseCession {
  reference: string;
  status: CessionStatus;
  vehicles?: {
    brand: string;
    model: string;
    license_plate: string;
  };
  repair_orders?: {
    reference: string;
    created_at?: string;
    clients?: {
      first_name: string;
      last_name: string;
    };
    vehicles?: {
      brand: string;
      model: string;
      license_plate: string;
    };
  };
  insurance_companies?: {
    name: string;
  };
}

export interface NewCession extends Omit<BaseNewCession, 'id' | 'created_at' | 'updated_at' | 'user_id'> {
  reference: string;
  status?: CessionStatus;
}

export interface UpdateCession extends BaseUpdateCession {
  reference?: string;
  status?: CessionStatus;
}
