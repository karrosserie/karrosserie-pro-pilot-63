

import { supabase } from '@/integrations/supabase/client';
import { mockAccountsService } from '@/services/mock/accounts';

// Temporary manual types until migration is applied
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
  last_sync: string;
  created_at: string;
  updated_at: string;
};

export type NewAccount = Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_sync'>;
export type UpdateAccount = Partial<Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// Temporary: Use mock service until Supabase migration is applied
export const accountsService = {
  // Get all accounts for the current user
  async getAll(): Promise<Account[]> {
    console.log('Using mock accounts service - Supabase migration not yet applied');
    return mockAccountsService.getAll();
  },

  // Get a single account by ID
  async getById(id: string): Promise<Account | null> {
    console.log('Using mock accounts service - Supabase migration not yet applied');
    return mockAccountsService.getById(id);
  },

  // Create a new account
  async create(account: Omit<NewAccount, 'user_id'>): Promise<Account> {
    console.log('Using mock accounts service - Supabase migration not yet applied');
    return mockAccountsService.create(account as NewAccount);
  },

  // Update an existing account
  async update(id: string, updates: UpdateAccount): Promise<Account> {
    console.log('Using mock accounts service - Supabase migration not yet applied');
    return mockAccountsService.update(id, updates);
  },

  // Delete an account
  async delete(id: string): Promise<void> {
    console.log('Using mock accounts service - Supabase migration not yet applied');
    return mockAccountsService.delete(id);
  },
};

