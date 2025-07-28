
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Quote = Database['public']['Tables']['quotes']['Row'];
export type NewQuote = Database['public']['Tables']['quotes']['Insert'];
export type UpdateQuote = Database['public']['Tables']['quotes']['Update'];

export const quotesService = {
  getAll: async () => {
    // Récupérer d'abord tous les devis
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (quotesError) {
      console.error('Error fetching quotes:', quotesError);
      throw new Error(quotesError.message);
    }

    if (!quotes || quotes.length === 0) {
      return [];
    }

    // Récupérer les clients associés
    const clientIds = quotes.map(quote => quote.client_id).filter(id => id);
    let clientsData = [];
    if (clientIds.length > 0) {
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('id, first_name, last_name')
        .in('id', clientIds);
      
      if (!clientsError) {
        clientsData = clients || [];
      }
    }

    // Récupérer les véhicules associés
    const vehicleIds = quotes.map(quote => quote.vehicle_id).filter(id => id);
    let vehiclesData = [];
    if (vehicleIds.length > 0) {
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id, brand, model, license_plate')
        .in('id', vehicleIds);
      
      if (!vehiclesError) {
        vehiclesData = vehicles || [];
      }
    }

    // Combiner les données
    const quotesWithRelations = quotes.map(quote => ({
      ...quote,
      clients: clientsData.find(client => client.id === quote.client_id) || null,
      vehicles: vehiclesData.find(vehicle => vehicle.id === quote.vehicle_id) || null
    }));
    
    return quotesWithRelations;
  },

  getById: async (id: string) => {
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();
      
    if (quoteError) {
      console.error(`Error fetching quote with id ${id}:`, quoteError);
      throw new Error(quoteError.message);
    }

    // Récupérer le client si présent
    let clientData = null;
    if (quote.client_id) {
      const { data: client } = await supabase
        .from('clients')
        .select('id, first_name, last_name')
        .eq('id', quote.client_id)
        .single();
      clientData = client;
    }

    // Récupérer le véhicule si présent
    let vehicleData = null;
    if (quote.vehicle_id) {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('id, brand, model, license_plate')
        .eq('id', quote.vehicle_id)
        .single();
      vehicleData = vehicle;
    }

    return {
      ...quote,
      clients: clientData,
      vehicles: vehicleData
    };
  },

  getLastQuoteByUser: async () => {
    // Récupérer l'utilisateur actuel
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      throw new Error('User not authenticated');
    }

    const { data: userCompany } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', user.id)
      .eq('active', true)
      .single();

    if (!userCompany?.company_id) {
      throw new Error('No active company found');
    }

    const { data: quote, error } = await supabase
      .from('quotes')
      .select('reference')
      .eq('company_id', userCompany.company_id)
      .order('reference', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching last quote:', error);
      throw new Error(error.message);
    }

    return quote;
  },
  
  create: async (quote: NewQuote) => {
    console.log('Creating quote with data:', quote);

    // Récupérer l'utilisateur actuel
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      throw new Error('User not authenticated');
    }

    // Ajouter automatiquement le company_id
    const { data: userCompany } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', user.id)
      .eq('active', true)
      .single();

    if (!userCompany?.company_id) {
      throw new Error('No active company found');
    }

    const quoteWithCompanyId = {
      ...quote,
      company_id: userCompany.company_id
    };

    const { data, error } = await supabase
      .from('quotes')
      .insert([quoteWithCompanyId])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating quote:', error);
      throw new Error(error.message);
    }
    
    console.log('Quote created successfully:', data);
    return data;
  },
  
  update: async (id: string, quote: UpdateQuote) => {
    console.log('Updating quote with id:', id, 'and data:', quote);

    const { data, error } = await supabase
      .from('quotes')
      .update(quote)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating quote with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    console.log('Quote updated successfully:', data);
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting quote with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  },

  // Vérifier si un devis existe pour un rapport d'expertise donné
  getByReportId: async (reportId: string) => {
    const { data, error } = await supabase
      .from('quotes')
      .select('id, reference')
      .filter('report_id', 'eq', reportId);
      
    if (error) {
      console.error(`Error fetching quote for report ${reportId}:`, error);
      return null;
    }
    
    return data && data.length > 0 ? data[0] : null;
  },

  // Créer un devis à partir d'un rapport d'expertise
  createFromReport: async (expertiseReport: any) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      throw new Error('User not authenticated');
    }

    const { data: userCompany } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', user.id)
      .eq('active', true)
      .single();

    if (!userCompany?.company_id) {
      throw new Error('No active company found');
    }

    // Générer le numéro de devis (entier auto-incrémenté)
    const lastQuote = await quotesService.getLastQuoteByUser();
    const lastNumber = lastQuote?.reference ? parseInt(lastQuote.reference) : 0;
    const reference = (lastNumber + 1).toString();
    
    // Préparer les données pour le devis avec les réparations et pièces du rapport
    let repairs = [];
    let parts = [];
    
    // Parser les réparations du rapport si elles existent
    if (expertiseReport.repairs_data) {
      try {
        repairs = JSON.parse(expertiseReport.repairs_data);
      } catch (error) {
        console.error('Error parsing repairs_data:', error);
        repairs = [];
      }
    }
    
    // Parser les pièces du rapport si elles existent
    if (expertiseReport.parts_data) {
      try {
        parts = JSON.parse(expertiseReport.parts_data);
      } catch (error) {
        console.error('Error parsing parts_data:', error);
        parts = [];
      }
    }
    
    const quoteData: any = {
      reference,
      client_id: expertiseReport.client_id,
      vehicle_id: expertiseReport.vehicle_id,
      amount: expertiseReport.amount || 0,
      status: 'draft',
      notes: '',
      repairs_data: expertiseReport.repairs_data || null,
      parts_data: expertiseReport.parts_data || null,
      claim_number: expertiseReport.claim_number || '',
      report_number: expertiseReport.report_number || '',
      policy_number: expertiseReport.policy_number || '',
      report_date: expertiseReport.report_date || '',
      expert_name: expertiseReport.expert_name || '',
      incident_date: expertiseReport.incident_date || '',
      report_id: expertiseReport.id,
      company_id: userCompany.company_id,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const { data, error } = await supabase
      .from('quotes')
      .insert([quoteData])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating quote from report:', error);
      throw new Error(error.message);
    }

    console.log('Quote created from report successfully:', data);
    return data;
  }
};
