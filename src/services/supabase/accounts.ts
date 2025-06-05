
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

export const accountsService = {
  // Get all accounts for the current user
  async getAll(): Promise<Account[]> {
    try {
      console.log('Attempting to fetch bank accounts from Supabase...');
      
      // Use the REST API directly with rpc or raw SQL
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.log('No authenticated user, using mock data');
        return mockAccountsService.getAll();
      }

      // Try using the postgrest client with explicit casting
      const { data, error } = await (supabase as any)
        .from('bank_accounts')
        .select('*')
        .eq('user_id', session.session.user.id);

      if (error) {
        console.error('Supabase error:', error);
        console.log('Falling back to mock data');
        return mockAccountsService.getAll();
      }

      console.log('Successfully fetched accounts from Supabase:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching accounts:', error);
      console.log('Using mock data as fallback');
      return mockAccountsService.getAll();
    }
  },

  // Get a single account by ID
  async getById(id: string): Promise<Account | null> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        return mockAccountsService.getById(id);
      }

      const { data, error } = await (supabase as any)
        .from('bank_accounts')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.session.user.id)
        .single();

      if (error) {
        console.error('Error fetching account:', error);
        return mockAccountsService.getById(id);
      }

      return data;
    } catch (error) {
      console.error('Error fetching account:', error);
      return mockAccountsService.getById(id);
    }
  },

  // Create a new account
  async create(account: NewAccount): Promise<Account> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        return mockAccountsService.create(account);
      }

      const accountData = {
        ...account,
        user_id: session.session.user.id,
      };

      const { data, error } = await (supabase as any)
        .from('bank_accounts')
        .insert([accountData])
        .select()
        .single();

      if (error) {
        console.error('Error creating account:', error);
        return mockAccountsService.create(account);
      }

      return data;
    } catch (error) {
      console.error('Error creating account:', error);
      return mockAccountsService.create(account);
    }
  },

  // Update an existing account
  async update(id: string, updates: UpdateAccount): Promise<Account> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        return mockAccountsService.update(id, updates);
      }

      const { data, error } = await (supabase as any)
        .from('bank_accounts')
        .update(updates)
        .eq('id', id)
        .eq('user_id', session.session.user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating account:', error);
        return mockAccountsService.update(id, updates);
      }

      return data;
    } catch (error) {
      console.error('Error updating account:', error);
      return mockAccountsService.update(id, updates);
    }
  },

  // Delete an account
  async delete(id: string): Promise<void> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        return mockAccountsService.delete(id);
      }

      const { error } = await (supabase as any)
        .from('bank_accounts')
        .delete()
        .eq('id', id)
        .eq('user_id', session.session.user.id);

      if (error) {
        console.error('Error deleting account:', error);
        return mockAccountsService.delete(id);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      return mockAccountsService.delete(id);
    }
  },
};
