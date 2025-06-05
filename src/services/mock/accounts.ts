
// Service mock temporaire pour les comptes jusqu'à ce que la migration Supabase soit appliquée
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

// Données mock temporaires
const mockAccounts: Account[] = [
  {
    id: '1',
    user_id: 'mock-user-1',
    name: 'Compte Principal',
    bank: 'Banque Populaire',
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'CCBPFRPPNCY',
    balance: 15000.50,
    status: 'Actif',
    type: 'Courant',
    last_sync: '2024-01-15T10:30:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    user_id: 'mock-user-1',
    name: 'Compte Épargne',
    bank: 'Crédit Agricole',
    iban: 'FR76 9876 5432 1098 7654 3210 987',
    bic: 'AGRIFRPP',
    balance: 25000.00,
    status: 'Actif',
    type: 'Épargne',
    last_sync: '2024-01-14T15:45:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-14T15:45:00Z'
  }
];

export const mockAccountsService = {
  // Get all accounts for the current user
  async getAll(): Promise<Account[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAccounts;
  },

  // Get a single account by ID
  async getById(id: string): Promise<Account | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAccounts.find(account => account.id === id) || null;
  },

  // Create a new account
  async create(account: NewAccount): Promise<Account> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newAccount: Account = {
      ...account,
      id: Math.random().toString(36).substring(2, 9),
      user_id: 'mock-user-1',
      type: account.type || 'Courant',
      last_sync: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockAccounts.push(newAccount);
    return newAccount;
  },

  // Update an existing account
  async update(id: string, updates: UpdateAccount): Promise<Account> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = mockAccounts.findIndex(account => account.id === id);
    if (index === -1) {
      throw new Error('Account not found');
    }
    
    mockAccounts[index] = {
      ...mockAccounts[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    return mockAccounts[index];
  },

  // Delete an account
  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockAccounts.findIndex(account => account.id === id);
    if (index === -1) {
      throw new Error('Account not found');
    }
    
    mockAccounts.splice(index, 1);
  },
};
