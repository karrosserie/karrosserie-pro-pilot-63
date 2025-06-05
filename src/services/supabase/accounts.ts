
import { mockAccountsService, Account, NewAccount, UpdateAccount } from '../mock/accounts';

// Export des types du service mock pour la compatibilité
export type { Account, NewAccount, UpdateAccount };

export const accountsService = {
  // Get all accounts for the current user
  async getAll(): Promise<Account[]> {
    console.log('Using mock accounts service - bank_accounts table not yet available in Supabase');
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
