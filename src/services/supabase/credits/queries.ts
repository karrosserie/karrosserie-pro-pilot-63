
import { supabase } from '@/integrations/supabase/client';
import { Credit } from './types';
import { checkTableExists } from './table-utils';

export const getCredits = async (): Promise<Credit[]> => {
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

    if (!creditsData || creditsData.length === 0) {
      return [];
    }

    // Fetch related data separately for each credit
    const creditsWithRelations = await Promise.all(
      creditsData.map(async (credit: Credit) => {
        const enrichedCredit = { ...credit };

        // Get client and vehicle from the invoice only
        let clientData = null;
        let vehicleData = null;

        // Get client and vehicle data from the invoice
        if (credit.invoice_id) {
          try {
            const { data: invoice, error: invoiceError } = await supabase
              .from('invoices')
              .select('id, reference, client_id, vehicle_id')
              .eq('id', credit.invoice_id)
              .maybeSingle();

            if (!invoiceError && invoice) {
              enrichedCredit.invoices = { id: invoice.id, reference: invoice.reference };

              // Get client from invoice if we don't have it yet
              if (!clientData && invoice.client_id) {
                try {
                  const { data: client, error: clientError } = await supabase
                    .from('clients')
                    .select('id, first_name, last_name, email, client_type, company_name')
                    .eq('id', invoice.client_id)
                    .maybeSingle();

                  if (!clientError && client) {
                    clientData = client;
                  }
                } catch (error) {
                  console.warn('Error fetching client from invoice:', error);
                }
              }

              // Get vehicle from invoice if we don't have it yet
              if (!vehicleData && invoice.vehicle_id) {
                try {
                  const { data: vehicle, error: vehicleError } = await supabase
                    .from('vehicles')
                    .select(`
                      id,
                      license_plate,
                      car_brands(id, name),
                      car_models(id, name)
                    `)
                    .eq('id', invoice.vehicle_id)
                    .maybeSingle();

                  if (!vehicleError && vehicle) {
                    vehicleData = vehicle;
                  }
                } catch (error) {
                  console.warn('Error fetching vehicle from invoice:', error);
                }
              }
            }
          } catch (invoiceError) {
            console.warn(`Could not fetch invoice for credit ${credit.id}:`, invoiceError);
          }
        }

        // Assign the found data
        if (clientData) {
          enrichedCredit.clients = clientData;
        }
        if (vehicleData) {
          enrichedCredit.vehicles = vehicleData;
        }

        return enrichedCredit;
      })
    );

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

    // Get client and vehicle data from the invoice
    let clientData = null;
    let vehicleData = null;

    if (data.invoice_id) {
      const { data: invoice } = await supabase
        .from('invoices')
        .select('id, reference, client_id, vehicle_id')
        .eq('id', data.invoice_id)
        .maybeSingle();
      
      if (invoice) {
        enrichedCredit.invoices = { id: invoice.id, reference: invoice.reference };

        if (invoice.client_id) {
          const { data: client } = await supabase
            .from('clients')
            .select('id, first_name, last_name, email, client_type, company_name')
            .eq('id', invoice.client_id)
            .maybeSingle();
          if (client) clientData = client;
        }

        if (invoice.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select(`
              id,
              license_plate,
              car_brands(id, name),
              car_models(id, name)
            `)
            .eq('id', invoice.vehicle_id)
            .maybeSingle();
          if (vehicle) vehicleData = vehicle;
        }
      }
    }

    if (clientData) enrichedCredit.clients = clientData;
    if (vehicleData) enrichedCredit.vehicles = vehicleData;

    return enrichedCredit;
  } catch (error) {
    console.error('Error fetching credit:', error);
    throw error;
  }
};
