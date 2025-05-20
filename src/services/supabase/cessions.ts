
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Cession = Database['public']['Tables']['cessions']['Row'];
export type NewCession = Database['public']['Tables']['cessions']['Insert'];
export type UpdateCession = Database['public']['Tables']['cessions']['Update'];

export const cessionsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('cessions')
      .select(`
        *,
        vehicles(brand, model, license_plate)
      `)
      .order('sale_date', { ascending: false });

    if (error) {
      console.error('Error fetching cessions:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('cessions')
      .select(`
        *,
        vehicles(id, brand, model, license_plate)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching cession with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  create: async (cession: NewCession) => {
    const { data, error } = await supabase
      .from('cessions')
      .insert([cession])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating cession:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, cession: UpdateCession) => {
    const { data, error } = await supabase
      .from('cessions')
      .update(cession)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating cession with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('cessions')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting cession with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};
