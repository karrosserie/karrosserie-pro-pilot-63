
import { supabase } from '@/integrations/supabase/client';
import { Invoice } from './types';

export const invoiceQueries = {
  getAll: async (showArchived?: boolean): Promise<Invoice[]> => {
    const { getCurrentUserCompanyId } = await import('../auth-company');
    const companyId = await getCurrentUserCompanyId();
    
    let query = supabase
      .from('invoices')
      .select(`
        *,
        clients (
          id,
          first_name,
          last_name,
          email,
          phone,
          address,
          postal_code,
          city,
          client_type,
          company_name
        ),
        vehicles (
          id,
          license_plate,
          mileage,
          car_brands(id, name),
          car_models(id, name)
        ),
        repair_orders (
          id,
          reference
        )
      `)
      .eq('company_id', companyId);
    
    // Only filter by archived if explicitly specified
    if (showArchived !== undefined) {
      query = query.eq('archived', showArchived);
    }
    
    const { data: invoicesWithJoins, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      throw new Error(error.message);
    }

    // Transform data - simple synchronous mapping without additional queries
    return (invoicesWithJoins || []).map((invoice) => ({
      ...invoice,
      clients: Array.isArray(invoice.clients) && invoice.clients.length > 0 ? invoice.clients[0] : invoice.clients,
      vehicles: Array.isArray(invoice.vehicles) && invoice.vehicles.length > 0 ? invoice.vehicles[0] : invoice.vehicles,
      repair_orders: Array.isArray(invoice.repair_orders) && invoice.repair_orders.length > 0 ? invoice.repair_orders[0] : invoice.repair_orders
    } as Invoice));
  },

  getById: async (id: string): Promise<Invoice> => {
    // Essayer d'abord avec les joins
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (
          id,
          first_name,
          last_name,
          email,
          phone,
          address,
          postal_code,
          city,
          client_type,
          company_name
        ),
        vehicles (
          id,
          license_plate,
          mileage,
          car_brands(id, name),
          car_models(id, name)
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
    
    // Si les joins ont échoué ou si clients est null, récupérer les données manuellement
    let enrichedData = { ...data };
    
    if (!data.clients && data.client_id) {
      console.log('Récupération manuelle des données client pour client_id:', data.client_id);
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, first_name, last_name, email, phone, address, postal_code, city, client_type, company_name')
        .eq('id', data.client_id)
        .single();
        
      if (!clientError && clientData) {
        enrichedData.clients = clientData;
      }
    }
    
    if (!data.vehicles && data.vehicle_id) {
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select(`
          id, 
          license_plate,
          mileage,
          car_brands(id, name),
          car_models(id, name)
        `)
        .eq('id', data.vehicle_id)
        .single();
        
      if (!vehicleError && vehicleData) {
        enrichedData.vehicles = vehicleData;
      }
    }
    
    // Transform the joined data to match our Invoice interface
    const transformedInvoice = {
      ...enrichedData,
      clients: Array.isArray(enrichedData.clients) && enrichedData.clients.length > 0 ? enrichedData.clients[0] : enrichedData.clients,
      vehicles: Array.isArray(enrichedData.vehicles) && enrichedData.vehicles.length > 0 ? enrichedData.vehicles[0] : enrichedData.vehicles,
      repair_orders: Array.isArray(enrichedData.repair_orders) && enrichedData.repair_orders.length > 0 ? enrichedData.repair_orders[0] : enrichedData.repair_orders
    } as Invoice;
    
    return transformedInvoice;
  },

  getLastInvoiceByUser: async () => {
    const { getCurrentUserCompanyId } = await import('../auth-company');
    const companyId = await getCurrentUserCompanyId();

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('reference')
      .eq('company_id', companyId)
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
