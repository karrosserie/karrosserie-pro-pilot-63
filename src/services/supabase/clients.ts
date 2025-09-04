import { STATIC_CLIENTS, mockApiDelay, filterByCompanyId } from '@/data/staticData';
import { Database } from '@/integrations/supabase/types';

export type Client = Database['public']['Tables']['clients']['Row'] & {
  company?: string;
  oodrive_recipient_id?: string | null;
};
export type NewClient = Database['public']['Tables']['clients']['Insert'] & {
  company?: string;
  oodrive_recipient_id?: string | null;
};
export type UpdateClient = Database['public']['Tables']['clients']['Update'] & {
  company?: string;
  oodrive_recipient_id?: string | null;
};

// Variable pour stocker les clients modifiés
let clientsData = [...STATIC_CLIENTS];

export const clientsService = {
  getAll: async () => {
    console.log('Fetching all clients...');
    await mockApiDelay(300);
    
    // Gérer l'impersonation côté client
    const impersonationData = localStorage.getItem('admin_impersonation');
    let companyId = 'demo-company-123';
    
    if (impersonationData) {
      try {
        const data = JSON.parse(impersonationData);
        console.log('Using impersonation company_id:', data.company_id);
        companyId = data.company_id;
      } catch (error) {
        console.error('Error parsing impersonation data:', error);
      }
    }
    
    const filteredClients = filterByCompanyId(clientsData, companyId)
      .sort((a, b) => a.last_name.localeCompare(b.last_name));
    
    console.log('Clients fetched successfully:', filteredClients);
    return filteredClients;
  },

  getById: async (id: string) => {
    console.log(`Fetching client with id: ${id}`);
    await mockApiDelay(200);
    
    const client = clientsData.find(c => c.id === id);
    
    if (!client) {
      console.error(`Client with id ${id} not found`);
      throw new Error(`Client with id ${id} not found`);
    }
    
    console.log('Client fetched successfully:', client);
    return client;
  },
  
  create: async (client: any) => {
    await mockApiDelay(500);
    
    const company = client.company;
    const companyId = 'demo-company-123';
    
    const clientData = {
      id: `client-${Date.now()}`,
      first_name: client.firstName,
      last_name: client.lastName,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      postal_code: client.zipCode,
      company_id: companyId,
      driver_license_front_url: client.driverLicenseFrontUrl || null,
      driver_license_back_url: client.driverLicenseBackUrl || null,
      oodrive_recipient_id: client.oodrive_recipient_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Creating client with data:', clientData);
    
    // Ajouter le client aux données en mémoire
    clientsData.push(clientData);
    
    console.log('Client created successfully:', clientData);
    return { ...clientData, company };
  },
  
  update: async (id: string, client: any) => {
    await mockApiDelay(500);
    
    const company = client.company;
    const clientIndex = clientsData.findIndex(c => c.id === id);
    
    if (clientIndex === -1) {
      throw new Error(`Client with id ${id} not found`);
    }
    
    const updatedClientData = {
      ...clientsData[clientIndex],
      first_name: client.firstName,
      last_name: client.lastName,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      postal_code: client.zipCode,
      driver_license_front_url: client.driverLicenseFrontUrl || null,
      driver_license_back_url: client.driverLicenseBackUrl || null,
      oodrive_recipient_id: client.oodrive_recipient_id || null,
      updated_at: new Date().toISOString(),
    };

    console.log('Updating client with data:', updatedClientData);
    
    // Mettre à jour dans les données en mémoire
    clientsData[clientIndex] = updatedClientData;
    
    console.log('Client updated successfully:', updatedClientData);
    return { ...updatedClientData, company };
  },
  
  delete: async (id: string) => {
    await mockApiDelay(300);
    
    console.log(`Deleting client with id: ${id}`);
    const clientIndex = clientsData.findIndex(c => c.id === id);
    
    if (clientIndex === -1) {
      throw new Error(`Client with id ${id} not found`);
    }
    
    // Supprimer des données en mémoire
    clientsData.splice(clientIndex, 1);
    
    console.log('Client deleted successfully');
    return true;
  }
};
