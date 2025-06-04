
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Credit = Database['public']['Tables']['credits']['Row'];
type CreditInsert = Database['public']['Tables']['credits']['Insert'];
type CreditUpdate = Database['public']['Tables']['credits']['Update'];

export const creditsService = {
  // Get all credits for the current user
  async getCredits() {
    console.log('Fetching credits...');
    try {
      // Try to get credits with joins first
      const { data, error } = await supabase
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
        const { data: basicData, error: basicError } = await supabase
          .from('credits')
          .select('*')
          .order('created_at', { ascending: false });

        if (basicError) throw basicError;

        // Fetch related data separately
        const creditsWithRelations = await Promise.all(
          (basicData || []).map(async (credit) => {
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
  async getCredit(id: string) {
    const { data, error } = await supabase
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
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
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
  }) {
    const { data, error } = await supabase
      .from('credits')
      .update(creditData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a credit
  async deleteCredit(id: string) {
    const { error } = await supabase
      .from('credits')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Generate next reference number
  async generateReference() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('credits')
        .select('reference')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

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
