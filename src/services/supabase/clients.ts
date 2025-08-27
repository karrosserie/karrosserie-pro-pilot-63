import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { getCurrentUserCompanyId } from './auth-company';

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

export const clientsService = {
  getAll: async (companyId?: string) => {
    console.log('Fetching all clients for company:', companyId);
    let query = supabase
      .from('clients')
      .select('*')
      .order('last_name');
    
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching clients:', error);
      throw new Error(error.message);
    }
    
    console.log('Clients fetched successfully:', data);
    return data;
  },

  getById: async (id: string) => {
    console.log(`Fetching client with id: ${id}`);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching client with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    console.log('Client fetched successfully:', data);
    return data;
  },
  
  create: async (client: any) => {
    // Extract company field and create clientData without it
    const company = client.company;
    const companyId = await getCurrentUserCompanyId();
    
    const clientData = {
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
      oodrive_recipient_id: client.oodrive_recipient_id || null
    };

    console.log('Creating client with data:', clientData);
    console.log('Client data structure:', {
      hasDriverLicenseFront: !!clientData.driver_license_front_url,
      hasDriverLicenseBack: !!clientData.driver_license_back_url,
      frontUrl: clientData.driver_license_front_url,
      backUrl: clientData.driver_license_back_url
    });

    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating client:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(error.message);
    }
    
    console.log('Client created successfully:', data);
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
      driver_license_front_url: client.driverLicenseFrontUrl || null,
      driver_license_back_url: client.driverLicenseBackUrl || null,
      oodrive_recipient_id: client.oodrive_recipient_id || null
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
    
    console.log('Client updated successfully:', data);
    // Add back the company field to the returned data for the frontend
    return { ...data, company };
  },
  
  delete: async (id: string) => {
    console.log(`Deleting client with id: ${id}`);
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting client with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    console.log('Client deleted successfully');
    return true;
  }
};
