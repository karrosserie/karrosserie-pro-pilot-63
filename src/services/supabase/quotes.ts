
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { safeNumber } from '@/lib/utils';

export type Quote = Database['public']['Tables']['quotes']['Row'] & {
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  vehicles?: {
    id: string;
    license_plate: string;
    car_brands?: {
      id: string;
      name: string;
    } | null;
    car_models?: {
      id: string;
      name: string;
    } | null;
  } | null;
};
export type NewQuote = Database['public']['Tables']['quotes']['Insert'];
export type UpdateQuote = Database['public']['Tables']['quotes']['Update'];

export const quotesService = {
  getAll: async () => {
    // Utiliser getCurrentUserCompanyId pour gérer correctement l'impersonation
    const { getCurrentUserCompanyId } = await import('./auth-company');
    const companyId = await getCurrentUserCompanyId();
    
    // Récupérer les devis filtrés par company_id
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('*')
      .eq('company_id', companyId)
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
    
    return data;
  },
  
  update: async (id: string, quote: UpdateQuote) => {
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

  archive: async (id: string) => {
    const { error } = await supabase
      .from('quotes')
      .update({ archived: true })
      .eq('id', id);
      
    if (error) {
      console.error(`Error archiving quote with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  },

  restore: async (id: string) => {
    const { error } = await supabase
      .from('quotes')
      .update({ archived: false })
      .eq('id', id);
      
    if (error) {
      console.error(`Error restoring quote with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  },
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
        // Normaliser les valeurs numériques
        repairs = repairs.map(repair => ({
          ...repair,
          quantity: safeNumber(repair.quantity),
          unitCost: safeNumber(repair.unitCost),
          discount: safeNumber(repair.discount),
          vat: safeNumber(repair.vat || 20)
        }));
      } catch (error) {
        console.error('Error parsing repairs_data:', error);
        repairs = [];
      }
    }
    
    // Parser les pièces du rapport si elles existent
    if (expertiseReport.parts_data) {
      try {
        parts = JSON.parse(expertiseReport.parts_data);
        // Normaliser les valeurs numériques
        parts = parts.map(part => ({
          ...part,
          quantity: safeNumber(part.quantity),
          unitCost: safeNumber(part.unitCost),
          discount: safeNumber(part.discount),
          vat: safeNumber(part.vat || 20)
        }));
      } catch (error) {
        console.error('Error parsing parts_data:', error);
        parts = [];
      }
    }

    // Parser les remises globales du rapport si elles existent
    let discounts = [];
    if (expertiseReport.global_discount_data) {
      try {
        discounts = JSON.parse(expertiseReport.global_discount_data);
      } catch (error) {
        console.error('Error parsing global_discount_data:', error);
        discounts = [];
      }
    }
    
    const quoteData: any = {
      reference,
      client_id: expertiseReport.client_id,
      vehicle_id: expertiseReport.vehicle_id,
      amount: expertiseReport.amount || 0,
      status: 'draft',
      notes: '',
      repairs_data: repairs.length > 0 ? JSON.stringify(repairs) : null,
      parts_data: parts.length > 0 ? JSON.stringify(parts) : null,
      discounts_data: discounts.length > 0 ? JSON.stringify(discounts) : null,
      claim_number: expertiseReport.claim_number || '',
      report_number: expertiseReport.report_number || '',
      policy_number: expertiseReport.policy_number || '',
      report_date: expertiseReport.report_date || '',
      expert_name: expertiseReport.expert_name || '',
      incident_date: expertiseReport.incident_date || '',
      report_id: expertiseReport.id,
      source_report_id: expertiseReport.id, // Stocker le rapport source pour traçabilité
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

    return data;
  },

  getUnconvertedQuotesFromReports: async () => {
    // Utiliser getCurrentUserCompanyId pour gérer correctement l'impersonation
    const { getCurrentUserCompanyId } = await import('./auth-company');
    const companyId = await getCurrentUserCompanyId();
    
    // Récupérer les devis créés depuis des rapports d'expertise qui ne sont pas archivés
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('*')
      .eq('company_id', companyId)
      .not('source_report_id', 'is', null) // Créés depuis un rapport
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (quotesError) {
      console.error('Error fetching quotes from reports:', quotesError);
      throw new Error(quotesError.message);
    }

    if (!quotes || quotes.length === 0) {
      return [];
    }

    // Vérifier si la table repair_orders existe et filtrer les devis déjà convertis
    const quotesWithoutOrders = [];
    
    for (const quote of quotes) {
      try {
        const { data: orders } = await supabase
          .from('repair_orders')
          .select('id')
          .eq('quote_id', quote.id)
          .limit(1);
        
        // Si pas d'ordre de réparation trouvé, ajouter à la liste
        if (!orders || orders.length === 0) {
          quotesWithoutOrders.push(quote);
        }
      } catch (error) {
        // Si la table repair_orders n'existe pas, on considère tous les devis comme non convertis
        quotesWithoutOrders.push(quote);
      }
    }

    if (quotesWithoutOrders.length === 0) {
      return [];
    }

    // Récupérer les clients associés
    const clientIds = quotesWithoutOrders.map(quote => quote.client_id).filter(id => id);
    let clientsData = [];
    if (clientIds.length > 0) {
      const { data: clients } = await supabase
        .from('clients')
        .select('id, first_name, last_name')
        .in('id', clientIds);
      
      if (clients) {
        clientsData = clients;
      }
    }

    // Récupérer les véhicules associés avec leurs marques et modèles
    const vehicleIds = quotesWithoutOrders.map(quote => quote.vehicle_id).filter(id => id);
    let vehiclesData = [];
    if (vehicleIds.length > 0) {
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select(`
          id,
          license_plate,
          brand,
          model,
          car_brands (
            id,
            name
          ),
          car_models (
            id,
            name
          )
        `)
        .in('id', vehicleIds);
      
      if (vehicles) {
        vehiclesData = vehicles;
      }
    }

    // Combiner les données
    const quotesWithRelations = quotesWithoutOrders.map(quote => ({
      ...quote,
      clients: clientsData.find(client => client.id === quote.client_id) || null,
      vehicles: vehiclesData.find(vehicle => vehicle.id === quote.vehicle_id) || null
    }));
    
    return quotesWithRelations;
  }
};
