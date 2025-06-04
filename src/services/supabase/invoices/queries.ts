
import { supabase } from '@/integrations/supabase/client';
import { Invoice } from './types';

export const invoiceQueries = {
  getAll: async (): Promise<Invoice[]> => {
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
    
    return invoicesWithJoins || [];
  },

  getById: async (id: string): Promise<Invoice> => {
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

  getLastInvoiceByUser: async () => {
    // Récupérer l'utilisateur actuel
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      throw new Error('User not authenticated');
    }

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('reference')
      .eq('user_id', user.id)
      .order('reference', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching last invoice:', error);
      throw new Error(error.message);
    }

    return invoice;
  }
};
