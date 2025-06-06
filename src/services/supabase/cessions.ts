
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Import the status type from the form types
import { CessionStatus } from '@/components/cessions/form/types';

// Extend the base types to include the new columns
type BaseCession = Database['public']['Tables']['cessions']['Row'];
type BaseNewCession = Database['public']['Tables']['cessions']['Insert'];
type BaseUpdateCession = Database['public']['Tables']['cessions']['Update'];

export interface Cession extends BaseCession {
  reference: string;
  status: CessionStatus;
  vehicles?: {
    brand: string;
    model: string;
    license_plate: string;
  };
}

export interface NewCession extends Omit<BaseNewCession, 'id' | 'created_at' | 'updated_at'> {
  reference: string;
  status?: CessionStatus;
}

export interface UpdateCession extends BaseUpdateCession {
  reference?: string;
  status?: CessionStatus;
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
    
    // Transform data to match our extended interface using safe property access
    return (data || []).map(item => ({
      ...item,
      reference: (item as any).reference || '',
      status: (item as any).status || 'en_attente'
    })) as Cession[];
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
    
    // Transform data to match our extended interface using safe property access
    return {
      ...data,
      reference: (data as any).reference || '',
      status: (data as any).status || 'en_attente'
    } as Cession;
  },
  
  create: async (cession: NewCession): Promise<Cession> => {
    const { data, error } = await supabase
      .from('cessions')
      .insert([{
        ...cession,
        reference: cession.reference,
        status: cession.status || 'en_attente'
      } as any])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating cession:', error);
      throw new Error(error.message);
    }
    
    return {
      ...data,
      reference: (data as any).reference || '',
      status: (data as any).status || 'en_attente'
    } as Cession;
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
    
    return {
      ...data,
      reference: (data as any).reference || '',
      status: (data as any).status || 'en_attente'
    } as Cession;
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
