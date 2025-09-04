
import { STATIC_QUOTES, STATIC_CLIENTS, STATIC_VEHICLES, mockApiDelay, filterByCompanyId } from '@/data/staticData';
import { Database } from '@/integrations/supabase/types';

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
  repair_orders?: {
    id: string;
    reference: string;
  }[] | null;
};
export type NewQuote = Database['public']['Tables']['quotes']['Insert'];
export type UpdateQuote = Database['public']['Tables']['quotes']['Update'];

// Variable pour stocker les devis modifiés
let quotesData = [...STATIC_QUOTES];

export const quotesService = {
  getAll: async () => {
    console.log('Fetching quotes...');
    await mockApiDelay(300);
    
    // Gérer l'impersonation côté client
    const impersonationData = localStorage.getItem('admin_impersonation');
    let companyId = 'demo-company-123';
    
    if (impersonationData) {
      try {
        const data = JSON.parse(impersonationData);
        console.log('Using impersonation company_id for quotes:', data.company_id);
        companyId = data.company_id;
      } catch (error) {
        console.error('Error parsing impersonation data for quotes:', error);
      }
    }

    // Filtrer et enrichir les devis avec les données associées
    const filteredQuotes = filterByCompanyId(quotesData, companyId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(quote => {
        // Enrichir avec les données client
        let clientData = null;
        if (quote.client_id) {
          const client = STATIC_CLIENTS.find(c => c.id === quote.client_id);
          if (client) {
            clientData = {
              id: client.id,
              first_name: client.first_name,
              last_name: client.last_name,
            };
          }
        }

        // Enrichir avec les données véhicule
        let vehicleData = null;
        if (quote.vehicle_id) {
          const vehicle = STATIC_VEHICLES.find(v => v.id === quote.vehicle_id);
          if (vehicle) {
            vehicleData = {
              id: vehicle.id,
              license_plate: vehicle.license_plate,
              car_brands: vehicle.car_brands,
              car_models: vehicle.car_models,
            };
          }
        }

        return {
          ...quote,
          clients: clientData,
          vehicles: vehicleData
        };
      });

    console.log('Quotes fetched successfully:', filteredQuotes);
    return filteredQuotes;
  },

  getById: async (id: string) => {
    console.log(`Fetching quote with id: ${id}`);
    await mockApiDelay(200);
    
    const quote = quotesData.find(q => q.id === id);
    
    if (!quote) {
      console.error(`Quote with id ${id} not found`);
      throw new Error(`Quote with id ${id} not found`);
    }

    // Enrichir avec les données client
    let clientData = null;
    if (quote.client_id) {
      const client = STATIC_CLIENTS.find(c => c.id === quote.client_id);
      if (client) {
        clientData = {
          id: client.id,
          first_name: client.first_name,
          last_name: client.last_name,
        };
      }
    }

    // Enrichir avec les données véhicule
    let vehicleData = null;
    if (quote.vehicle_id) {
      const vehicle = STATIC_VEHICLES.find(v => v.id === quote.vehicle_id);
      if (vehicle) {
        vehicleData = {
          id: vehicle.id,
          license_plate: vehicle.license_plate,
          car_brands: vehicle.car_brands,
          car_models: vehicle.car_models,
        };
      }
    }

    return {
      ...quote,
      clients: clientData,
      vehicles: vehicleData
    };
  },

  getLastQuoteByUser: async () => {
    await mockApiDelay(200);
    
    const companyId = 'demo-company-123';
    const companyQuotes = filterByCompanyId(quotesData, companyId)
      .sort((a, b) => b.reference.localeCompare(a.reference));

    if (companyQuotes.length === 0) {
      return null;
    }

    return {
      reference: companyQuotes[0].reference
    };
  },
  
  create: async (quote: NewQuote) => {
    console.log('Creating quote with data:', quote);
    await mockApiDelay(500);

    const newQuote = {
      ...quote,
      id: `quote-${Date.now()}`,
      company_id: 'demo-company-123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    quotesData.push(newQuote);
    
    console.log('Quote created successfully:', newQuote);
    return newQuote;
  },
  
  update: async (id: string, quote: UpdateQuote) => {
    console.log('Updating quote with id:', id, 'and data:', quote);
    await mockApiDelay(500);

    const quoteIndex = quotesData.findIndex(q => q.id === id);
    
    if (quoteIndex === -1) {
      throw new Error(`Quote with id ${id} not found`);
    }
    
    const updatedQuote = {
      ...quotesData[quoteIndex],
      ...quote,
      updated_at: new Date().toISOString(),
    };
    
    quotesData[quoteIndex] = updatedQuote;
    
    console.log('Quote updated successfully:', updatedQuote);
    return updatedQuote;
  },
  
  delete: async (id: string) => {
    await mockApiDelay(300);
    
    const quoteIndex = quotesData.findIndex(q => q.id === id);
    
    if (quoteIndex === -1) {
      throw new Error(`Quote with id ${id} not found`);
    }
    
    quotesData.splice(quoteIndex, 1);
    
    return true;
  },

  // Vérifier si un devis existe pour un rapport d'expertise donné
  getByReportId: async (reportId: string) => {
    await mockApiDelay(200);
    
    const quote = quotesData.find(q => q.report_id === reportId);
    
    if (!quote) {
      return null;
    }
    
    return {
      id: quote.id,
      reference: quote.reference
    };
  },

  // Créer un devis à partir d'un rapport d'expertise
  createFromReport: async (expertiseReport: any) => {
    await mockApiDelay(600);
    
    // Générer le numéro de devis (entier auto-incrémenté)
    const lastQuote = await quotesService.getLastQuoteByUser();
    const lastNumber = lastQuote?.reference ? parseInt(lastQuote.reference.replace('DEV-2024-', '')) : 0;
    const reference = `DEV-2024-${(lastNumber + 1).toString().padStart(3, '0')}`;
    
    const quoteData: any = {
      id: `quote-${Date.now()}`,
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
      company_id: 'demo-company-123',
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    quotesData.push(quoteData);

    console.log('Quote created from report successfully:', quoteData);
    return quoteData;
  }
};
