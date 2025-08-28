import { supabase } from '@/integrations/supabase/client';
import { demoBankAccounts } from '@/data/demoData';

export type BankAccount = {
  id: string;
  name: string;
  bank_name: string;
  account_number: string;
  iban: string;
  bic: string;
  account_type: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  company_id: string;
  user_id: string;
};

// Check if we're in demo mode (simplified check)
const isDemoMode = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname.includes('demo') ||
         process.env.NODE_ENV === 'development';
};

export const bankAccountsService = {
  getAll: async (): Promise<BankAccount[]> => {
    // In demo mode, return static data
    if (isDemoMode()) {
      console.log('Using demo bank accounts data');
      return demoBankAccounts;
    }

    // In production, fetch from Supabase
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching bank accounts:', error);
      // Fallback to demo data if Supabase fails
      console.log('Fallback to demo bank accounts data');
      return demoBankAccounts;
    }
    
    return data || [];
  }
};