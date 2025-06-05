
import { supabase } from '@/integrations/supabase/client';

// Use Supabase generated types once migration is applied
export type Account = {
  id: string;
  user_id: string;
  name: string;
  bank: string;
  iban: string;
  bic: string;
  balance: number;
  status: string;
  type: string;
  created_at: string;
  updated_at: string;
};

export type NewAccount = Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type UpdateAccount = Partial<Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export const accountsService = {
  // Get all accounts for the current user
  async getAll(): Promise<Account[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }

    return data || [];
  },

  // Get a single account by ID
  async getById(id: string): Promise<Account | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching account:', error);
      throw error;
    }

    return data;
  },

  // Create a new account
  async create(account: NewAccount): Promise<Account> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('accounts')
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

    return data;
  },

  // Update an existing account
  async update(id: string, updates: UpdateAccount): Promise<Account> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },
};
