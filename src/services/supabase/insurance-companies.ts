
import { supabase } from '@/integrations/supabase/client';

export type AssistanceCompany = {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  created_at: string;
};

export type InsuranceCompany = {
  id: string;
  name: string;
  address?: string;
  address2?: string;
  city?: string;
  zipcode?: string;
  phone?: string;
  email?: string;
  assistance_id?: string | null;
  assistance?: AssistanceCompany | null;
  created_at: string;
  updated_at: string;
};

export const insuranceCompaniesService = {
  getAll: async (): Promise<InsuranceCompany[]> => {
    const { data, error } = await supabase
      .from('insurance_companies')
      .select('*, assistance:assistance_companies(*)')
      .order('name');

    if (error) {
      console.error('Error fetching insurance companies:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  }
};
