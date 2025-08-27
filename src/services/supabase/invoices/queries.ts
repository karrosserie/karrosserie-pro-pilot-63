
import { supabase } from '@/integrations/supabase/client';
import { Invoice } from './types';

export const invoiceQueries = {
  getAll: async (): Promise<Invoice[]> => {
    console.log('=== DEBUT RÉCUPÉRATION FACTURES ===');
    console.log('Fetching invoices...');
    
    // Définir explicitement la company_id en mode impersonation
    const impersonationData = localStorage.getItem('admin_impersonation');
    if (impersonationData) {
      try {
        const data = JSON.parse(impersonationData);
        console.log('Using impersonation company_id for invoices:', data.company_id);
        await supabase.rpc('set_config' as any, {
          setting_name: 'app.impersonation_company_id',
          setting_value: data.company_id,
          is_local: true
        });
      } catch (error) {
        console.error('Error setting impersonation config for invoices:', error);
      }
    }
    
    // First, try to get invoices with joins
    const { data: invoicesWithJoins, error: joinError } = await supabase
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
          city
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
              .select('id, first_name, last_name, email, phone, address, postal_code, city')
              .eq('id', invoice.client_id)
              .single();
            clientData = client;
          }

          // Try to get vehicle data
          if (invoice.vehicle_id) {
            const { data: vehicle } = await supabase
              .from('vehicles')
              .select(`
                id, 
                license_plate,
                mileage,
                car_brands(id, name),
                car_models(id, name)
              `)
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
          } as Invoice;
        })
      );

      return enrichedInvoices;
    }
    console.log('=== JOINS RÉUSSIS, TRANSFORMATION EN COURS ===');
    console.log('invoicesWithJoins:', invoicesWithJoins);
    const transformedInvoices = await Promise.all(
      (invoicesWithJoins || []).map(async (invoice) => {
        // Si pas de données client mais un client_id, récupérer manuellement
        if (!invoice.clients && invoice.client_id) {
          console.log('Récupération manuelle des données client pour invoice:', invoice.id, 'client_id:', invoice.client_id);
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('id, first_name, last_name, email, phone, address, postal_code, city')
            .eq('id', invoice.client_id)
            .single();
            
          if (!clientError && clientData) {
            invoice.clients = clientData;
            console.log('Données client récupérées avec succès:', clientData);
          } else {
            console.error('Erreur lors de la récupération du client:', clientError);
          }
        }
        
        // Si pas de données véhicule mais un vehicle_id, récupérer manuellement
        if (!invoice.vehicles && invoice.vehicle_id) {
          console.log('Récupération manuelle des données véhicule pour invoice:', invoice.id, 'vehicle_id:', invoice.vehicle_id);
          const { data: vehicleData, error: vehicleError } = await supabase
            .from('vehicles')
            .select(`
              id, 
              license_plate,
              mileage,
              car_brands(id, name),
              car_models(id, name)
            `)
            .eq('id', invoice.vehicle_id)
            .single();
            
          if (!vehicleError && vehicleData) {
            invoice.vehicles = vehicleData;
            console.log('Données véhicule récupérées avec succès:', vehicleData);
          } else {
            console.error('Erreur lors de la récupération du véhicule:', vehicleError);
          }
        }
        
        return {
          ...invoice,
          clients: Array.isArray(invoice.clients) && invoice.clients.length > 0 ? invoice.clients[0] : invoice.clients,
          vehicles: Array.isArray(invoice.vehicles) && invoice.vehicles.length > 0 ? invoice.vehicles[0] : invoice.vehicles,
          repair_orders: Array.isArray(invoice.repair_orders) && invoice.repair_orders.length > 0 ? invoice.repair_orders[0] : invoice.repair_orders
        } as Invoice;
      })
    );
    
    console.log('=== FACTURES TRANSFORMÉES AVANT RETOUR ===');
    console.log('transformedInvoices:', transformedInvoices);
    console.log('Premier invoice transformé:', transformedInvoices[0]);
    console.log('Premier invoice.clients transformé:', transformedInvoices[0]?.clients);
    
    return transformedInvoices;
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
          city
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
    
    console.log('Données récupérées depuis Supabase:', data);
    
    // Si les joins ont échoué ou si clients est null, récupérer les données manuellement
    let enrichedData = { ...data };
    
    if (!data.clients && data.client_id) {
      console.log('Récupération manuelle des données client pour client_id:', data.client_id);
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, first_name, last_name, email, phone, address, postal_code, city')
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
