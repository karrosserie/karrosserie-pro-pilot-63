
import { supabase } from '@/integrations/supabase/client';

export type InsuranceCompany = {
  id: string;
  name: string;
  address?: string;
  address2?: string;
  city?: string;
  zipcode?: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
};

export const insuranceCompaniesService = {
  getAll: async (): Promise<InsuranceCompany[]> => {
    const { data, error } = await supabase
      .from('insurance_companies')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching insurance companies:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  }
};
