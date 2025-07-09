
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

    const { data: quote, error } = await supabase
      .from('quotes')
      .select('reference')
      .eq('user_id', user.id)
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

    // Ajouter automatiquement le user_id
    const quoteWithUserId = {
      ...quote,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('quotes')
      .insert([quoteWithUserId])
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

  // Vérifier si un devis existe pour un rapport d'expertise donné (temporaire via notes)
  getByReportId: async (reportId: string) => {
    const { data, error } = await supabase
      .from('quotes')
      .select('id, reference, notes')
      .like('notes', `%Report ID: ${reportId}%`);
      
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

    // Générer le prochain numéro de référence
    const lastQuote = await quotesService.getLastQuoteByUser();
    let nextNumber = 1;
    
    if (lastQuote?.reference) {
      const match = lastQuote.reference.match(/D-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }
    
    const nextReference = `D-${nextNumber.toString().padStart(6, '0')}`;
    
    const quoteData: any = {
      reference: nextReference,
      client_id: expertiseReport.client_id,
      vehicle_id: expertiseReport.vehicle_id,
      amount: 0, // Sera calculé selon les données du rapport
      status: 'En cours',
      notes: `Devis généré automatiquement à partir du rapport d'expertise ${expertiseReport.report_number}`,
      user_id: user.id,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours de validité
    };

    // Temporairement, on va stocker l'ID du rapport dans les notes jusqu'à ce que la colonne soit ajoutée
    quoteData.notes += ` (Report ID: ${expertiseReport.id})`;

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
