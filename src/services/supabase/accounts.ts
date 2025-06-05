
import { supabase } from '@/integrations/supabase/client';
import { mockAccountsService } from '@/services/mock/accounts';

// Types for compatibility with existing components
export interface Account {
  id: string;
  user_id: string;
  name: string;
  bank: string;
  iban: string;
  bic: string;
  balance: number;
  type: string;
  status: string;
  last_sync?: string;
  created_at: string;
  updated_at: string;
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

// Check if bank_accounts table is available by testing a simple query
const checkBankAccountsTableExists = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bank_accounts' as any)
      .select('id')
      .limit(1);
    
    return !error || error.code !== '42P01'; // 42P01 = table does not exist
  } catch {
    return false;
  }
};

export const accountsService = {
  // Get all accounts for the current user
  async getAll(): Promise<Account[]> {
    console.log('Checking if bank_accounts table exists in Supabase...');
    
    const tableExists = await checkBankAccountsTableExists();
    
    if (!tableExists) {
      console.log('bank_accounts table not available, using mock service');
      return mockAccountsService.getAll();
    }

    console.log('Using Supabase accounts service - bank_accounts table');
    
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('bank_accounts' as any)
      .select('*')
      .eq('user_id', session.session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }

    return data.map((bankAccount: any): Account => ({
      id: bankAccount.id,
      user_id: bankAccount.user_id,
      name: bankAccount.name,
      bank: bankAccount.bank,
      iban: bankAccount.iban,
      bic: bankAccount.bic,
      balance: Number(bankAccount.balance),
      type: bankAccount.type || 'Courant',
      status: bankAccount.status || 'Actif',
      last_sync: bankAccount.last_sync || undefined,
      created_at: bankAccount.created_at,
      updated_at: bankAccount.updated_at,
    }));
  },

  // Get a single account by ID
  async getById(id: string): Promise<Account | null> {
    const tableExists = await checkBankAccountsTableExists();
    
    if (!tableExists) {
      return mockAccountsService.getById(id);
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('bank_accounts' as any)
      .select('*')
      .eq('id', id)
      .eq('user_id', session.session.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Account not found
      }
      console.error('Error fetching account:', error);
      throw error;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      bank: data.bank,
      iban: data.iban,
      bic: data.bic,
      balance: Number(data.balance),
      type: data.type || 'Courant',
      status: data.status || 'Actif',
      last_sync: data.last_sync || undefined,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  },

  // Create a new account
  async create(account: NewAccount): Promise<Account> {
    const tableExists = await checkBankAccountsTableExists();
    
    if (!tableExists) {
      return mockAccountsService.create(account);
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const accountData = {
      user_id: session.session.user.id,
      name: account.name,
      bank: account.bank,
      iban: account.iban,
      bic: account.bic,
      balance: account.balance,
      type: account.type,
      status: account.status,
    };

    const { data, error } = await supabase
      .from('bank_accounts' as any)
      .insert(accountData)
      .select()
      .single();

    if (error) {
      console.error('Error creating account:', error);
      throw error;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      bank: data.bank,
      iban: data.iban,
      bic: data.bic,
      balance: Number(data.balance),
      type: data.type || 'Courant',
      status: data.status || 'Actif',
      last_sync: data.last_sync || undefined,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  },

  // Update an existing account
  async update(id: string, updates: UpdateAccount): Promise<Account> {
    const tableExists = await checkBankAccountsTableExists();
    
    if (!tableExists) {
      return mockAccountsService.update(id, updates);
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('bank_accounts' as any)
      .update(updateData)
      .eq('id', id)
      .eq('user_id', session.session.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating account:', error);
      throw error;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      bank: data.bank,
      iban: data.iban,
      bic: data.bic,
      balance: Number(data.balance),
      type: data.type || 'Courant',
      status: data.status || 'Actif',
      last_sync: data.last_sync || undefined,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  },

  // Delete an account
  async delete(id: string): Promise<void> {
    const tableExists = await checkBankAccountsTableExists();
    
    if (!tableExists) {
      return mockAccountsService.delete(id);
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('bank_accounts' as any)
      .delete()
      .eq('id', id)
      .eq('user_id', session.session.user.id);

    if (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },
};
