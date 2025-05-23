
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Client = Database['public']['Tables']['clients']['Row'] & {
  company?: string;
};
export type NewClient = Database['public']['Tables']['clients']['Insert'] & {
  company?: string;
};
export type UpdateClient = Database['public']['Tables']['clients']['Update'] & {
  company?: string;
};

export const clientsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('last_name');

    if (error) {
      console.error('Error fetching clients:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching client with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  create: async (client: any) => {
    // Extract company field and create clientData without it
    const company = client.company;
    const clientData = {
      first_name: client.firstName,
      last_name: client.lastName,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      postal_code: client.zipCode,
      user_id: client.user_id,
      driver_license_front_url: client.driverLicenseFrontUrl,
      driver_license_back_url: client.driverLicenseBackUrl
    };

    console.log('Creating client with data:', clientData);

    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating client:', error);
      throw new Error(error.message);
    }
    
    // Add back the company field to the returned data for the frontend
    return { ...data, company };
  },
  
  update: async (id: string, client: any) => {
    // Extract company field and create clientData without it
    const company = client.company;
    const clientData = {
      first_name: client.firstName,
      last_name: client.lastName,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      postal_code: client.zipCode,
      driver_license_front_url: client.driverLicenseFrontUrl,
      driver_license_back_url: client.driverLicenseBackUrl
    };

    console.log('Updating client with data:', clientData);

    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating client with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    // Add back the company field to the returned data for the frontend
    return { ...data, company };
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting client with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};
