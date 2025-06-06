
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Extend the base types to include the new columns
type BaseCession = Database['public']['Tables']['cessions']['Row'];
type BaseNewCession = Database['public']['Tables']['cessions']['Insert'];
type BaseUpdateCession = Database['public']['Tables']['cessions']['Update'];

export interface Cession extends BaseCession {
  reference: string;
  status: 'en_attente' | 'envoyee' | 'signee' | 'payee';
  vehicles?: {
    brand: string;
    model: string;
    license_plate: string;
  };
}

export interface NewCession extends Omit<BaseNewCession, 'id' | 'created_at' | 'updated_at'> {
  reference: string;
  status?: 'en_attente' | 'envoyee' | 'signee' | 'payee';
}

export interface UpdateCession extends BaseUpdateCession {
  reference?: string;
  status?: 'en_attente' | 'envoyee' | 'signee' | 'payee';
}

export const cessionsService = {
  getAll: async (): Promise<Cession[]> => {
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
    
    return data as Cession[];
  },

  getById: async (id: string): Promise<Cession> => {
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
    
    return data as Cession;
  },
  
  create: async (cession: NewCession): Promise<Cession> => {
    const { data, error } = await supabase
      .from('cessions')
      .insert([cession as any])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating cession:', error);
      throw new Error(error.message);
    }
    
    return data as Cession;
  },
  
  update: async (id: string, cession: UpdateCession): Promise<Cession> => {
    const { data, error } = await supabase
      .from('cessions')
      .update(cession as any)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating cession with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data as Cession;
  },
  
  delete: async (id: string): Promise<boolean> => {
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
