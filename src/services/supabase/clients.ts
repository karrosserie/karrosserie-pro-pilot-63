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
  getAll: async () => {
    // Utiliser getCurrentUserCompanyId pour gérer correctement l'impersonation
    const companyId = await getCurrentUserCompanyId();
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', companyId)
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
    const companyId = await getCurrentUserCompanyId();
    
    const clientData: Record<string, any> = {
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
      auto_relances_disabled: client.autoRelancesDisabled || false,
      oodrive_recipient_id: client.oodrive_recipient_id || null,
      // Nouveaux champs entreprise
      client_type: client.clientType || 'particulier',
      company_name: client.companyName || null,
      manager_id_url: client.managerIdUrl || null,
      kbis_url: client.kbisUrl || null
    };

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
    
    // Ne construire que les champs explicitement fournis (pas undefined)
    const clientData: Record<string, any> = {};
    
    if (client.firstName !== undefined) clientData.first_name = client.firstName;
    if (client.lastName !== undefined) clientData.last_name = client.lastName;
    if (client.email !== undefined) clientData.email = client.email;
    if (client.phone !== undefined) clientData.phone = client.phone;
    if (client.address !== undefined) clientData.address = client.address;
    if (client.city !== undefined) clientData.city = client.city;
    if (client.zipCode !== undefined) clientData.postal_code = client.zipCode;
    if (client.driverLicenseFrontUrl !== undefined) clientData.driver_license_front_url = client.driverLicenseFrontUrl || null;
    if (client.driverLicenseBackUrl !== undefined) clientData.driver_license_back_url = client.driverLicenseBackUrl || null;
    if (client.autoRelancesDisabled !== undefined) clientData.auto_relances_disabled = client.autoRelancesDisabled;
    if (client.oodrive_recipient_id !== undefined) clientData.oodrive_recipient_id = client.oodrive_recipient_id || null;
    
    // Nouveaux champs entreprise
    if (client.clientType !== undefined) clientData.client_type = client.clientType;
    if (client.companyName !== undefined) clientData.company_name = client.companyName || null;
    if (client.managerIdUrl !== undefined) clientData.manager_id_url = client.managerIdUrl || null;
    if (client.kbisUrl !== undefined) clientData.kbis_url = client.kbisUrl || null;

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
