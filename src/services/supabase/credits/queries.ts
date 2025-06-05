
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
    // Try to fetch credits with joins first
    const { data, error } = await (supabase as any)
      .from('credits')
      .select(`
        *,
        clients!inner(id, first_name, last_name),
        vehicles!left(id, brand, model, license_plate),
        invoices!left(id, reference)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Joins failed, falling back to basic query with separate fetches:', error);
      
      // Fallback to basic query without joins
      const { data: basicData, error: basicError } = await (supabase as any)
        .from('credits')
        .select('*')
        .order('created_at', { ascending: false });

      if (basicError) throw basicError;

      // Fetch related data separately for each credit
      const creditsWithRelations = await Promise.all(
        (basicData || []).map(async (credit: Credit) => {
          const enrichedCredit = { ...credit };

          // Fetch client data if client_id exists
          if (credit.client_id) {
            try {
              const { data: client } = await supabase
                .from('clients')
                .select('id, first_name, last_name')
                .eq('id', credit.client_id)
                .single();
              
              if (client) {
                enrichedCredit.clients = client;
              }
            } catch (clientError) {
              console.warn(`Could not fetch client for credit ${credit.id}:`, clientError);
            }
          }

          // Fetch vehicle data if vehicle_id exists
          if (credit.vehicle_id) {
            try {
              const { data: vehicle } = await supabase
                .from('vehicles')
                .select('id, brand, model, license_plate')
                .eq('id', credit.vehicle_id)
                .single();
              
              if (vehicle) {
                enrichedCredit.vehicles = vehicle;
              }
            } catch (vehicleError) {
              console.warn(`Could not fetch vehicle for credit ${credit.id}:`, vehicleError);
            }
          }

          // Fetch invoice data if invoice_id exists
          if (credit.invoice_id) {
            try {
              const { data: invoice } = await supabase
                .from('invoices')
                .select('id, reference')
                .eq('id', credit.invoice_id)
                .single();
              
              if (invoice) {
                enrichedCredit.invoices = invoice;
              }
            } catch (invoiceError) {
              console.warn(`Could not fetch invoice for credit ${credit.id}:`, invoiceError);
            }
          }

          return enrichedCredit;
        })
      );

      console.log('Credits with relations fetched:', creditsWithRelations);
      return creditsWithRelations;
    }

    console.log('Credits fetched with joins:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching credits:', error);
    throw error;
  }
};

export const getCredit = async (id: string): Promise<Credit> => {
  try {
    const { data, error } = await (supabase as any)
      .from('credits')
      .select(`
        *,
        clients!left(id, first_name, last_name),
        vehicles!left(id, brand, model, license_plate),
        invoices!left(id, reference)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching credit with joins, trying basic fetch:', error);
      
      // Fallback to basic query
      const { data: basicData, error: basicError } = await (supabase as any)
        .from('credits')
        .select('*')
        .eq('id', id)
        .single();

      if (basicError) throw basicError;

      // Fetch relations separately
      const enrichedCredit = { ...basicData };

      if (basicData.client_id) {
        const { data: client } = await supabase
          .from('clients')
          .select('id, first_name, last_name')
          .eq('id', basicData.client_id)
          .single();
        if (client) enrichedCredit.clients = client;
      }

      if (basicData.vehicle_id) {
        const { data: vehicle } = await supabase
          .from('vehicles')
          .select('id, brand, model, license_plate')
          .eq('id', basicData.vehicle_id)
          .single();
        if (vehicle) enrichedCredit.vehicles = vehicle;
      }

      if (basicData.invoice_id) {
        const { data: invoice } = await supabase
          .from('invoices')
          .select('id, reference')
          .eq('id', basicData.invoice_id)
          .single();
        if (invoice) enrichedCredit.invoices = invoice;
      }

      return enrichedCredit;
    }

    return data;
  } catch (error) {
    console.error('Error fetching credit:', error);
    throw error;
  }
};
