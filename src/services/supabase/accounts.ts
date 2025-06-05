import { supabase } from '@/integrations/supabase/client';
import { mockAccountsService, Account, NewAccount, UpdateAccount } from '../mock/accounts';

// Export des types du service mock pour la compatibilité
export type { Account, NewAccount, UpdateAccount };

// Fonction pour vérifier si la table accounts existe
const checkTableExists = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('accounts' as any).select('id').limit(1);
    return !error || error.code !== '42P01'; // 42P01 = relation does not exist
  } catch {
    return false;
  }
};

export const accountsService = {
  // Get all accounts for the current user
  async getAll(): Promise<Account[]> {
    const tableExists = await checkTableExists();
    if (!tableExists) {
      return mockAccountsService.getAll();
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('accounts' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }

    return (data || []) as Account[];
  },

  // Get a single account by ID
  async getById(id: string): Promise<Account | null> {
    const tableExists = await checkTableExists();
    if (!tableExists) {
      return mockAccountsService.getById(id);
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('accounts' as any)
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching account:', error);
      throw error;
    }

    return data as Account;
  },

  // Create a new account
  async create(account: any): Promise<Account> {
    const tableExists = await checkTableExists();
    if (!tableExists) {
      return mockAccountsService.create(account);
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('accounts' as any)
      .insert({
        user_id: user.id,
        name: account.name,
        bank: account.bank,
        iban: account.iban,
        bic: account.bic,
        balance: account.balance,
        status: account.status,
        type: account.type,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating account:', error);
      throw error;
    }

    return data as Account;
  },

  // Update an existing account
  async update(id: string, updates: any): Promise<Account> {
    const tableExists = await checkTableExists();
    if (!tableExists) {
      return mockAccountsService.update(id, updates);
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('accounts' as any)
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating account:', error);
      throw error;
    }

    return data as Account;
  },

  // Delete an account
  async delete(id: string): Promise<void> {
    const tableExists = await checkTableExists();
    if (!tableExists) {
      return mockAccountsService.delete(id);
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('accounts' as any)
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },
};
