
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Types basés sur la table Supabase
type BankAccountRow = Database['public']['Tables']['bank_accounts']['Row'];
type BankAccountInsert = Database['public']['Tables']['bank_accounts']['Insert'];
type BankAccountUpdate = Database['public']['Tables']['bank_accounts']['Update'];

// Types exportés pour la compatibilité avec les composants existants
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

// Fonction pour convertir les données Supabase vers notre interface
const mapBankAccountToAccount = (bankAccount: BankAccountRow): Account => ({
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
});

export const accountsService = {
  // Get all accounts for the current user
  async getAll(): Promise<Account[]> {
    console.log('Using Supabase accounts service - bank_accounts table');
    
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', session.session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }

    return data.map(mapBankAccountToAccount);
  },

  // Get a single account by ID
  async getById(id: string): Promise<Account | null> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('bank_accounts')
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

    return mapBankAccountToAccount(data);
  },

  // Create a new account
  async create(account: NewAccount): Promise<Account> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const accountData: BankAccountInsert = {
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
      .from('bank_accounts')
      .insert(accountData)
      .select()
      .single();

    if (error) {
      console.error('Error creating account:', error);
      throw error;
    }

    return mapBankAccountToAccount(data);
  },

  // Update an existing account
  async update(id: string, updates: UpdateAccount): Promise<Account> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const updateData: BankAccountUpdate = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('bank_accounts')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', session.session.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating account:', error);
      throw error;
    }

    return mapBankAccountToAccount(data);
  },

  // Delete an account
  async delete(id: string): Promise<void> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('bank_accounts')
      .delete()
      .eq('id', id)
      .eq('user_id', session.session.user.id);

    if (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },
};
