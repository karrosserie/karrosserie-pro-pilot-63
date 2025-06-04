
import { supabase } from '@/integrations/supabase/client';

// Types personnalisés pour les credits puisque la table n'existe pas encore dans les types générés
export interface Credit {
  id: string;
  user_id: string;
  reference: string;
  client_id: string | null;
  vehicle_id: string | null;
  invoice_id: string | null;
  status: string;
  amount: number;
  items_data: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relations (optionnelles, ajoutées par les joins)
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  vehicles?: {
    id: string;
    brand: string;
    model: string;
    license_plate: string;
  } | null;
  invoices?: {
    id: string;
    reference: string;
  } | null;
}

export interface CreditInsert {
  user_id: string;
  reference: string;
  client_id?: string | null;
  vehicle_id?: string | null;
  invoice_id?: string | null;
  status: string;
  amount: number;
  items_data?: string | null;
  notes?: string | null;
}

export interface CreditUpdate {
  reference?: string;
  client_id?: string | null;
  vehicle_id?: string | null;
  invoice_id?: string | null;
  status?: string;
  amount?: number;
  items_data?: string | null;
  notes?: string | null;
}

const createCreditsTable = async (): Promise<boolean> => {
  try {
    console.log('Creating credits table...');
    
    // Create the table
    const { error: tableError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS credits (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          reference TEXT NOT NULL,
          client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
          vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
          invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
          status TEXT NOT NULL DEFAULT 'En attente' CHECK (status IN ('En attente', 'Payé', 'Annulé')),
          amount DECIMAL(10,2) NOT NULL DEFAULT 0,
          items_data JSONB,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          UNIQUE(user_id, reference)
        );
      `
    });

    if (tableError) {
      console.error('Error creating table:', tableError);
      return false;
    }

    // Enable RLS
    const { error: rlsError } = await supabase.rpc('exec', {
      sql: `
        ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
      `
    });

    if (rlsError) {
      console.error('Error enabling RLS:', rlsError);
    }

    // Create RLS policies
    const { error: policiesError } = await supabase.rpc('exec', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Users can view their own credits" ON credits
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY IF NOT EXISTS "Users can insert their own credits" ON credits
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY IF NOT EXISTS "Users can update their own credits" ON credits
          FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY IF NOT EXISTS "Users can delete their own credits" ON credits
          FOR DELETE USING (auth.uid() = user_id);
      `
    });

    if (policiesError) {
      console.error('Error creating policies:', policiesError);
    }

    // Create indexes
    const { error: indexError } = await supabase.rpc('exec', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_credits_user_id ON credits(user_id);
        CREATE INDEX IF NOT EXISTS idx_credits_client_id ON credits(client_id);
        CREATE INDEX IF NOT EXISTS idx_credits_vehicle_id ON credits(vehicle_id);
        CREATE INDEX IF NOT EXISTS idx_credits_invoice_id ON credits(invoice_id);
        CREATE INDEX IF NOT EXISTS idx_credits_status ON credits(status);
        CREATE INDEX IF NOT EXISTS idx_credits_created_at ON credits(created_at);
      `
    });

    if (indexError) {
      console.error('Error creating indexes:', indexError);
    }

    console.log('Credits table created successfully');
    return true;
  } catch (error) {
    console.error('Error in createCreditsTable:', error);
    return false;
  }
};

const checkTableExists = async (): Promise<boolean> => {
  try {
    const { error } = await (supabase as any)
      .from('credits')
      .select('id')
      .limit(1);
    
    return !error || error.code !== '42P01';
  } catch (error: any) {
    return error?.code !== '42P01';
  }
};

const ensureTableExists = async (): Promise<boolean> => {
  const exists = await checkTableExists();
  if (!exists) {
    return await createCreditsTable();
  }
  return true;
};

export const creditsService = {
  // Get all credits for the current user
  async getCredits(): Promise<Credit[]> {
    console.log('Fetching credits...');
    
    // Ensure table exists
    const tableReady = await ensureTableExists();
    if (!tableReady) {
      console.warn('Could not create credits table');
      return [];
    }

    try {
      // Utilisation de any pour contourner les erreurs de types
      const { data, error } = await (supabase as any)
        .from('credits')
        .select(`
          *,
          clients(id, first_name, last_name),
          vehicles(id, brand, model, license_plate),
          invoices(id, reference)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Joins failed, falling back to basic query:', error);
        // Fallback to basic query without joins
        const { data: basicData, error: basicError } = await (supabase as any)
          .from('credits')
          .select('*')
          .order('created_at', { ascending: false });

        if (basicError) throw basicError;

        // Fetch related data separately
        const creditsWithRelations = await Promise.all(
          (basicData || []).map(async (credit: Credit) => {
            const relations: any = { clients: null, vehicles: null, invoices: null };

            if (credit.client_id) {
              const { data: client } = await supabase
                .from('clients')
                .select('id, first_name, last_name')
                .eq('id', credit.client_id)
                .single();
              relations.clients = client;
            }

            if (credit.vehicle_id) {
              const { data: vehicle } = await supabase
                .from('vehicles')
                .select('id, brand, model, license_plate')
                .eq('id', credit.vehicle_id)
                .single();
              relations.vehicles = vehicle;
            }

            if (credit.invoice_id) {
              const { data: invoice } = await supabase
                .from('invoices')
                .select('id, reference')
                .eq('id', credit.invoice_id)
                .single();
              relations.invoices = invoice;
            }

            return { ...credit, ...relations };
          })
        );

        return creditsWithRelations;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching credits:', error);
      throw error;
    }
  },

  // Get a single credit by ID
  async getCredit(id: string): Promise<Credit> {
    await ensureTableExists();
    
    const { data, error } = await (supabase as any)
      .from('credits')
      .select(`
        *,
        clients(id, first_name, last_name),
        vehicles(id, brand, model, license_plate),
        invoices(id, reference)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new credit
  async createCredit(creditData: {
    reference: string;
    invoice_id: string | null;
    status: string;
    amount: number;
    items_data: string;
    notes?: string;
  }): Promise<Credit> {
    console.log('Creating credit with data:', creditData);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      throw new Error('User not authenticated');
    }

    console.log('User authenticated:', user.id);

    // Ensure table exists
    const tableReady = await ensureTableExists();
    if (!tableReady) {
      console.error('Could not create credits table');
      throw new Error('Impossible de créer la table des avoirs. Vérifiez vos permissions de base de données.');
    }

    const insertData = {
      user_id: user.id,
      reference: creditData.reference,
      invoice_id: creditData.invoice_id,
      status: creditData.status,
      amount: creditData.amount,
      items_data: creditData.items_data,
      notes: creditData.notes
    };

    console.log('Inserting data:', insertData);

    try {
      const { data, error } = await (supabase as any)
        .from('credits')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Credit created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createCredit:', error);
      throw error;
    }
  },

  // Update a credit
  async updateCredit(id: string, creditData: {
    reference?: string;
    invoice_id?: string | null;
    status?: string;
    amount?: number;
    items_data?: string;
    notes?: string;
  }): Promise<Credit> {
    await ensureTableExists();
    
    const { data, error } = await (supabase as any)
      .from('credits')
      .update(creditData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a credit
  async deleteCredit(id: string): Promise<boolean> {
    await ensureTableExists();
    
    const { error } = await (supabase as any)
      .from('credits')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Generate next reference number
  async generateReference(): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Ensure table exists
      const tableReady = await ensureTableExists();
      if (!tableReady) {
        console.warn('Could not create credits table, generating default reference');
        return '1';
      }

      const { data, error } = await (supabase as any)
        .from('credits')
        .select('reference')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.warn('Error fetching last reference, generating default:', error);
        return '1';
      }

      if (data && data.length > 0) {
        const lastReference = data[0].reference;
        const lastNumber = parseInt(lastReference);
        
        if (!isNaN(lastNumber)) {
          return (lastNumber + 1).toString();
        }
      }

      return '1';
    } catch (error) {
      console.error('Error generating reference:', error);
      return '1';
    }
  }
};
