
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Invoice = Database['public']['Tables']['invoices']['Row'] & {
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
  repair_orders?: {
    id: string;
    reference: string;
  } | null;
};

export type NewInvoice = Database['public']['Tables']['invoices']['Insert'];
export type UpdateInvoice = Database['public']['Tables']['invoices']['Update'];

export const invoicesService = {
  getAll: async () => {
    console.log('Fetching invoices...');
    
    // First, try to get invoices with joins
    const { data: invoicesWithJoins, error: joinError } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (
          id,
          first_name,
          last_name
        ),
        vehicles (
          id,
          brand,
          model,
          license_plate
        ),
        repair_orders (
          id,
          reference
        )
      `)
      .order('created_at', { ascending: false });

    // If joins fail, fall back to basic query
    if (joinError) {
      console.log('Joins failed, falling back to basic query:', joinError);
      
      const { data: basicInvoices, error: basicError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (basicError) {
        console.error('Error fetching invoices (basic):', basicError);
        throw new Error(basicError.message);
      }

      // Enrich with client and vehicle data separately
      const enrichedInvoices = await Promise.all(
        (basicInvoices || []).map(async (invoice) => {
          let clientData = null;
          let vehicleData = null;
          let repairOrderData = null;

          // Try to get client data
          if (invoice.client_id) {
            const { data: client } = await supabase
              .from('clients')
              .select('id, first_name, last_name')
              .eq('id', invoice.client_id)
              .single();
            clientData = client;
          }

          // Try to get vehicle data
          if (invoice.vehicle_id) {
            const { data: vehicle } = await supabase
              .from('vehicles')
              .select('id, brand, model, license_plate')
              .eq('id', invoice.vehicle_id)
              .single();
            vehicleData = vehicle;
          }

          // Try to get repair order data
          if (invoice.repair_order_id) {
            const { data: repairOrder } = await supabase
              .from('repair_orders')
              .select('id, reference')
              .eq('id', invoice.repair_order_id)
              .single();
            repairOrderData = repairOrder;
          }

          return {
            ...invoice,
            clients: clientData,
            vehicles: vehicleData,
            repair_orders: repairOrderData
          };
        })
      );

      return enrichedInvoices;
    }
    
    return invoicesWithJoins;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (
          id,
          first_name,
          last_name
        ),
        vehicles (
          id,
          brand,
          model,
          license_plate
        ),
        repair_orders (
          id,
          reference
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching invoice with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  create: async (invoice: NewInvoice) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const invoiceWithUser = {
      ...invoice,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('invoices')
      .insert([invoiceWithUser])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating invoice:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, invoice: UpdateInvoice) => {
    const { data, error } = await supabase
      .from('invoices')
      .update(invoice)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating invoice with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting invoice with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};
