
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

export const creditsService = {
  // Get all credits for the current user
  async getCredits(): Promise<Credit[]> {
    console.log('Fetching credits...');
    
    // Check if table exists first
    const tableExists = await checkTableExists();
    if (!tableExists) {
      console.warn('Credits table does not exist yet');
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await (supabase as any)
      .from('credits')
      .insert([{
        user_id: user.id,
        reference: creditData.reference,
        invoice_id: creditData.invoice_id,
        status: creditData.status,
        amount: creditData.amount,
        items_data: creditData.items_data,
        notes: creditData.notes
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
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

      // Check if table exists first
      const tableExists = await checkTableExists();
      if (!tableExists) {
        console.warn('Credits table does not exist, generating default reference');
        const currentYear = new Date().getFullYear();
        return `AV${currentYear}-001`;
      }

      const { data, error } = await (supabase as any)
        .from('credits')
        .select('reference')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.warn('Error fetching last reference, generating default:', error);
        const currentYear = new Date().getFullYear();
        return `AV${currentYear}-001`;
      }

      if (data && data.length > 0) {
        const lastReference = data[0].reference;
        const match = lastReference.match(/AV(\d{4})-(\d{3})$/);
        if (match) {
          const year = new Date().getFullYear();
          const lastYear = parseInt(match[1]);
          const lastNumber = parseInt(match[2]);
          
          if (year === lastYear) {
            return `AV${year}-${String(lastNumber + 1).padStart(3, '0')}`;
          } else {
            return `AV${year}-001`;
          }
        }
      }

      const currentYear = new Date().getFullYear();
      return `AV${currentYear}-001`;
    } catch (error) {
      console.error('Error generating reference:', error);
      const currentYear = new Date().getFullYear();
      return `AV${currentYear}-001`;
    }
  }
};
