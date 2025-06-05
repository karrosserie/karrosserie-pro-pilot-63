
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
    console.log('Using mock accounts service until Supabase types are regenerated');
    return mockAccountsService.getAll();
  },

  // Get a single account by ID
  async getById(id: string): Promise<Account | null> {
    return mockAccountsService.getById(id);
  },

  // Create a new account
  async create(account: NewAccount): Promise<Account> {
    return mockAccountsService.create(account);
  },

  // Update an existing account
  async update(id: string, updates: UpdateAccount): Promise<Account> {
    return mockAccountsService.update(id, updates);
  },

  // Delete an account
  async delete(id: string): Promise<void> {
    return mockAccountsService.delete(id);
  },
};
