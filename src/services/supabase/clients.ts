
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Client = Database['public']['Tables']['clients']['Row'];
export type NewClient = Database['public']['Tables']['clients']['Insert'];
export type UpdateClient = Database['public']['Tables']['clients']['Update'];

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
  
  create: async (client: NewClient) => {
    // Map front-end field names to database field names
    const clientData = {
      ...client,
      first_name: client.firstName || client.first_name,
      last_name: client.lastName || client.last_name,
      zip_code: client.zipCode || client.zip_code,
      driver_license_front_url: client.driverLicenseFrontUrl || client.driver_license_front_url,
      driver_license_back_url: client.driverLicenseBackUrl || client.driver_license_back_url,
    };

    // Remove camelCase properties to avoid conflicts
    delete clientData.firstName;
    delete clientData.lastName;
    delete clientData.zipCode;
    delete clientData.driverLicenseFrontUrl;
    delete clientData.driverLicenseBackUrl;

    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating client:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, client: UpdateClient) => {
    // Map front-end field names to database field names
    const clientData = {
      ...client,
      first_name: client.firstName || client.first_name,
      last_name: client.lastName || client.last_name,
      zip_code: client.zipCode || client.zip_code,
      driver_license_front_url: client.driverLicenseFrontUrl || client.driver_license_front_url,
      driver_license_back_url: client.driverLicenseBackUrl || client.driver_license_back_url,
    };

    // Remove camelCase properties to avoid conflicts
    delete clientData.firstName;
    delete clientData.lastName;
    delete clientData.zipCode;
    delete clientData.driverLicenseFrontUrl;
    delete clientData.driverLicenseBackUrl;

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
    
    return data;
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
