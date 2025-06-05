
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Account = Database['public']['Tables']['accounts']['Row'];
export type NewAccount = Database['public']['Tables']['accounts']['Insert'];
export type UpdateAccount = Database['public']['Tables']['accounts']['Update'];

export const accountsService = {
  // Get all accounts for the current user
  async getAll(): Promise<Account[]> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }

    return data || [];
  },

  // Get a single account by ID
  async getById(id: string): Promise<Account | null> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching account:', error);
      throw error;
    }

    return data;
  },

  // Create a new account
  async create(account: Omit<NewAccount, 'user_id'>): Promise<Account> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('accounts')
      .insert({
        ...account,
        user_id: user.id,
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
    const { data, error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', id)
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
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },
};
