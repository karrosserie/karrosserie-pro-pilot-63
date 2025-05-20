
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
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating client:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, client: UpdateClient) => {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
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
