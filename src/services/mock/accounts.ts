
// Service mock temporaire pour les comptes - à remplacer par le vrai service Supabase après migration
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
  last_sync: string;
};

export type NewAccount = Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_sync'>;
export type UpdateAccount = Partial<Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// Stockage temporaire en localStorage pour simuler une base de données
const STORAGE_KEY = 'mock_accounts';

const getStoredAccounts = (): Account[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveAccounts = (accounts: Account[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
};

const generateId = () => crypto.randomUUID();

export const mockAccountsService = {
  // Get all accounts for the current user (simulation)
  async getAll(): Promise<Account[]> {
    console.log('Using mock accounts service - Supabase migration not yet applied');
    return getStoredAccounts();
  },

  // Get a single account by ID
  async getById(id: string): Promise<Account | null> {
    const accounts = getStoredAccounts();
    return accounts.find(account => account.id === id) || null;
  },

  // Create a new account
  async create(account: NewAccount): Promise<Account> {
    const accounts = getStoredAccounts();
    const newAccount: Account = {
      ...account,
      id: generateId(),
      user_id: 'mock-user-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_sync: new Date().toISOString(),
    };
    
    accounts.push(newAccount);
    saveAccounts(accounts);
    return newAccount;
  },

  // Update an existing account
  async update(id: string, updates: UpdateAccount): Promise<Account> {
    const accounts = getStoredAccounts();
    const index = accounts.findIndex(account => account.id === id);
    
    if (index === -1) {
      throw new Error('Account not found');
    }
    
    accounts[index] = {
      ...accounts[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    saveAccounts(accounts);
    return accounts[index];
  },

  // Delete an account
  async delete(id: string): Promise<void> {
    const accounts = getStoredAccounts();
    const filteredAccounts = accounts.filter(account => account.id !== id);
    saveAccounts(filteredAccounts);
  },
};
