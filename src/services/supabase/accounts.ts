
import { supabase } from '@/integrations/supabase/client';
import { mockAccountsService, Account, NewAccount, UpdateAccount } from '../mock/accounts';

// Export des types du service mock pour la compatibilité
export type { Account, NewAccount, UpdateAccount };

export const accountsService = {
  // Get all accounts for the current user
  async getAll(): Promise<Account[]> {
    try {
      console.log('Attempting to fetch bank accounts from Supabase...');
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.log('No authenticated user, using mock service');
        return mockAccountsService.getAll();
      }

      // Utilisation temporaire du service mock en attendant que la table bank_accounts soit créée
      console.log('Using mock accounts service - bank_accounts table not yet available in Supabase');
      return mockAccountsService.getAll();

      // TODO: Uncomment when bank_accounts table is created and types are regenerated
      /*
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.user.id);

      if (error) {
        console.error('Supabase error fetching bank accounts:', error);
        if (error.code === '42P01') {
          console.log('bank_accounts table not found, using mock service');
          return mockAccountsService.getAll();
        }
        throw error;
      }

      console.log('Successfully fetched bank accounts from Supabase:', data);
      return data as Account[];
      */
    } catch (error) {
      console.error('Error in getAll:', error);
      console.log('Falling back to mock service');
      return mockAccountsService.getAll();
    }
  },

  // Get a single account by ID
  async getById(id: string): Promise<Account | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return mockAccountsService.getById(id);
      }

      // Utilisation temporaire du service mock
      return mockAccountsService.getById(id);

      // TODO: Uncomment when bank_accounts table is created and types are regenerated
      /*
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.user.id)
        .single();

      if (error) {
        console.error('Supabase error fetching bank account:', error);
        if (error.code === '42P01') {
          return mockAccountsService.getById(id);
        }
        throw error;
      }

      return data as Account;
      */
    } catch (error) {
      console.error('Error in getById:', error);
      return mockAccountsService.getById(id);
    }
  },

  // Create a new account
  async create(account: NewAccount): Promise<Account> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return mockAccountsService.create(account);
      }

      // Utilisation temporaire du service mock
      return mockAccountsService.create(account);

      // TODO: Uncomment when bank_accounts table is created and types are regenerated
      /*
      const { data, error } = await supabase
        .from('bank_accounts')
        .insert({
          ...account,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating bank account:', error);
        if (error.code === '42P01') {
          return mockAccountsService.create(account);
        }
        throw error;
      }

      return data as Account;
      */
    } catch (error) {
      console.error('Error in create:', error);
      return mockAccountsService.create(account);
    }
  },

  // Update an existing account
  async update(id: string, updates: UpdateAccount): Promise<Account> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return mockAccountsService.update(id, updates);
      }

      // Utilisation temporaire du service mock
      return mockAccountsService.update(id, updates);

      // TODO: Uncomment when bank_accounts table is created and types are regenerated
      /*
      const { data, error } = await supabase
        .from('bank_accounts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.user.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating bank account:', error);
        if (error.code === '42P01') {
          return mockAccountsService.update(id, updates);
        }
        throw error;
      }

      return data as Account;
      */
    } catch (error) {
      console.error('Error in update:', error);
      return mockAccountsService.update(id, updates);
    }
  },

  // Delete an account
  async delete(id: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return mockAccountsService.delete(id);
      }

      // Utilisation temporaire du service mock
      return mockAccountsService.delete(id);

      // TODO: Uncomment when bank_accounts table is created and types are regenerated
      /*
      const { error } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.user.id);

      if (error) {
        console.error('Supabase error deleting bank account:', error);
        if (error.code === '42P01') {
          return mockAccountsService.delete(id);
        }
        throw error;
      }
      */
    } catch (error) {
      console.error('Error in delete:', error);
      return mockAccountsService.delete(id);
    }
  },
};
