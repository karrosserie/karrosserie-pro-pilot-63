
import { supabase } from '@/integrations/supabase/client';
import { demoInsuranceCompanies } from '@/data/demoData';

export type InsuranceCompany = {
  id: string;
  name: string;
  contact_name?: string;
  address?: string;
  address2?: string;
  city?: string;
  postal_code?: string;
  zipcode?: string;
  phone?: string;
  email?: string;
  website?: string;
  siret?: string;
  created_at: string;
  updated_at: string;
  company_id?: string;
  user_id?: string;
};

// Check if we're in demo mode (simplified check)
const isDemoMode = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname.includes('demo') ||
         process.env.NODE_ENV === 'development';
};

export const insuranceCompaniesService = {
  getAll: async (): Promise<InsuranceCompany[]> => {
    // In demo mode, return static data
    if (isDemoMode()) {
      console.log('Using demo insurance companies data');
      return demoInsuranceCompanies.map(company => ({
        ...company,
        zipcode: company.postal_code,
        address2: undefined,
      }));
    }

    // In production, fetch from Supabase
    const { data, error } = await supabase
      .from('insurance_companies')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching insurance companies:', error);
      // Fallback to demo data if Supabase fails
      console.log('Fallback to demo insurance companies data');
      return demoInsuranceCompanies.map(company => ({
        ...company,
        zipcode: company.postal_code,
        address2: undefined,
      }));
    }
    
    return data || [];
  }
};
