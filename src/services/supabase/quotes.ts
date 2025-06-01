
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Quote = Database['public']['Tables']['quotes']['Row'];
export type NewQuote = Database['public']['Tables']['quotes']['Insert'];
export type UpdateQuote = Database['public']['Tables']['quotes']['Update'];

export const quotesService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        clients(first_name, last_name),
        vehicles(brand, model, license_plate)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quotes:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        clients(id, first_name, last_name),
        vehicles(id, brand, model, license_plate)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching quote with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  create: async (quote: NewQuote) => {
    console.log('Creating quote with data:', quote);

    const { data, error } = await supabase
      .from('quotes')
      .insert([quote])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating quote:', error);
      throw new Error(error.message);
    }
    
    console.log('Quote created successfully:', data);
    return data;
  },
  
  update: async (id: string, quote: UpdateQuote) => {
    console.log('Updating quote with id:', id, 'and data:', quote);

    const { data, error } = await supabase
      .from('quotes')
      .update(quote)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating quote with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    console.log('Quote updated successfully:', data);
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting quote with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};
