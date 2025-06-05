
import { supabase } from '@/integrations/supabase/client';
import { Credit } from './types';
import { checkTableExists } from './table-utils';

export const getCredits = async (): Promise<Credit[]> => {
  console.log('Fetching credits...');
  
  // Check if table exists first
  const tableExists = await checkTableExists();
  if (!tableExists) {
    console.warn('Credits table does not exist yet');
    return [];
  }

  try {
    // Fetch credits with separate queries for related data
    const { data: creditsData, error } = await (supabase as any)
      .from('credits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log('Raw credits data:', creditsData);

    if (!creditsData || creditsData.length === 0) {
      return [];
    }

    // Fetch related data separately for each credit
    const creditsWithRelations = await Promise.all(
      creditsData.map(async (credit: Credit) => {
        const enrichedCredit = { ...credit };

        // Fetch client data if client_id exists
        if (credit.client_id) {
          try {
            console.log('Fetching client for credit:', credit.id, 'client_id:', credit.client_id);
            const { data: client, error: clientError } = await supabase
              .from('clients')
              .select('id, first_name, last_name')
              .eq('id', credit.client_id)
              .maybeSingle();
            
            if (clientError) {
              console.warn('Error fetching client:', clientError);
            } else if (client) {
              console.log('Found client:', client);
              enrichedCredit.clients = client;
            } else {
              console.log('No client found for id:', credit.client_id);
            }
          } catch (clientError) {
            console.warn(`Could not fetch client for credit ${credit.id}:`, clientError);
          }
        }

        // Fetch vehicle data if vehicle_id exists
        if (credit.vehicle_id) {
          try {
            console.log('Fetching vehicle for credit:', credit.id, 'vehicle_id:', credit.vehicle_id);
            const { data: vehicle, error: vehicleError } = await supabase
              .from('vehicles')
              .select('id, brand, model, license_plate')
              .eq('id', credit.vehicle_id)
              .maybeSingle();
            
            if (vehicleError) {
              console.warn('Error fetching vehicle:', vehicleError);
            } else if (vehicle) {
              console.log('Found vehicle:', vehicle);
              enrichedCredit.vehicles = vehicle;
            } else {
              console.log('No vehicle found for id:', credit.vehicle_id);
            }
          } catch (vehicleError) {
            console.warn(`Could not fetch vehicle for credit ${credit.id}:`, vehicleError);
          }
        }

        // Fetch invoice data if invoice_id exists
        if (credit.invoice_id) {
          try {
            console.log('Fetching invoice for credit:', credit.id, 'invoice_id:', credit.invoice_id);
            const { data: invoice, error: invoiceError } = await supabase
              .from('invoices')
              .select('id, reference')
              .eq('id', credit.invoice_id)
              .maybeSingle();
            
            if (invoiceError) {
              console.warn('Error fetching invoice:', invoiceError);
            } else if (invoice) {
              console.log('Found invoice:', invoice);
              enrichedCredit.invoices = invoice;
            } else {
              console.log('No invoice found for id:', credit.invoice_id);
            }
          } catch (invoiceError) {
            console.warn(`Could not fetch invoice for credit ${credit.id}:`, invoiceError);
          }
        }

        console.log('Enriched credit:', enrichedCredit);
        return enrichedCredit;
      })
    );

    console.log('Credits with relations fetched:', creditsWithRelations);
    return creditsWithRelations;
  } catch (error) {
    console.error('Error fetching credits:', error);
    throw error;
  }
};

export const getCredit = async (id: string): Promise<Credit> => {
  try {
    const { data, error } = await (supabase as any)
      .from('credits')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Fetch relations separately
    const enrichedCredit = { ...data };

    if (data.client_id) {
      const { data: client } = await supabase
        .from('clients')
        .select('id, first_name, last_name')
        .eq('id', data.client_id)
        .maybeSingle();
      if (client) enrichedCredit.clients = client;
    }

    if (data.vehicle_id) {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('id, brand, model, license_plate')
        .eq('id', data.vehicle_id)
        .maybeSingle();
      if (vehicle) enrichedCredit.vehicles = vehicle;
    }

    if (data.invoice_id) {
      const { data: invoice } = await supabase
        .from('invoices')
        .select('id, reference')
        .eq('id', data.invoice_id)
        .maybeSingle();
      if (invoice) enrichedCredit.invoices = invoice;
    }

    return enrichedCredit;
  } catch (error) {
    console.error('Error fetching credit:', error);
    throw error;
  }
};
