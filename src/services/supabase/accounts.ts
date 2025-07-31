
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { getCurrentUserCompanyId } from './auth-company';

// Types derived from Supabase
type BankAccountRow = Database['public']['Tables']['bank_accounts']['Row'];
type BankAccountInsert = Database['public']['Tables']['bank_accounts']['Insert'];
type BankAccountUpdate = Database['public']['Tables']['bank_accounts']['Update'];

// Types for compatibility with existing components
export interface Account extends BankAccountRow {
  bridge?: {
    id: string;
    created_at: string;
    updated_at: string;
    bridge_id: string;
    access_token: string;
  } | null;
}

export interface NewAccount {
  name: string;
  bank: string;
  iban: string;
  bic: string;
  balance: number;
  type: string;
  status: string;
}

export interface UpdateAccount {
  name?: string;
  bank?: string;
  iban?: string;
  bic?: string;
  balance?: number;
  type?: string;
  status?: string;
}

export const accountsService = {
  // Get all accounts for the current user
  async getAll(): Promise<Account[]> {
    console.log('Fetching bank accounts from Supabase...');
    
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error('User not authenticated');
    }

    const companyId = await getCurrentUserCompanyId();
    
    const { data, error } = await supabase
      .from('bank_accounts')
      .select(`
        *,
        bridge(
          id,
          created_at,
          updated_at,
          bridge_id,
          access_token
        )
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Successfully fetched accounts from Supabase:', data);
    
    // Transform data to handle bridge relationship properly
    const transformedData = data?.map(account => ({
      ...account,
      bridge: Array.isArray(account.bridge) && account.bridge.length > 0 
        ? account.bridge[0] 
        : null
    })) || [];
    
    return transformedData;
  },

  // Get a single account by ID
  async getById(id: string): Promise<Account | null> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error('User not authenticated');
    }

    const companyId = await getCurrentUserCompanyId();
    
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .single();

    if (error) {
      console.error('Error fetching account:', error);
      throw error;
    }

    return data;
  },

  // Create a new account
  async create(account: NewAccount): Promise<Account> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error('User not authenticated');
    }

    const accountData: BankAccountInsert = {
      name: account.name,
      bank: account.bank,
      iban: account.iban,
      bic: account.bic,
      balance: account.balance,
      status: account.status,
      type: account.type,
      company_id: await getCurrentUserCompanyId(),
    };

    const { data, error } = await supabase
      .from('bank_accounts')
      .insert([accountData])
      .select()
      .single();

    if (error) {
      console.error('Error creating account:', error);
      throw error;
    }

    return data;
  },

  // Update an existing account
  async update(id: string, updates: UpdateAccount): Promise<Account> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error('User not authenticated');
    }

    const companyId = await getCurrentUserCompanyId();
    
    const { data, error } = await supabase
      .from('bank_accounts')
      .update(updates as BankAccountUpdate)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating account:', error);
      throw error;
    }

    return data;
  },

  // Delete an account
  async delete(id: string): Promise<void> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error('User not authenticated');
    }

    const companyId = await getCurrentUserCompanyId();
    
    const { error } = await supabase
      .from('bank_accounts')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },
};
