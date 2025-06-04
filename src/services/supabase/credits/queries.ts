
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
};

export const getCredit = async (id: string): Promise<Credit> => {
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
};
