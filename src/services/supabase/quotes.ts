
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
    // Calculer le montant total à partir des données de réparations et pièces
    let totalAmount = 0;
    
    if (quote.repairs_data) {
      try {
        const repairs = JSON.parse(quote.repairs_data);
        totalAmount += repairs.reduce((sum: number, repair: any) => sum + (repair.total || 0), 0);
      } catch (e) {
        console.error('Error parsing repairs data:', e);
      }
    }
    
    if (quote.parts_data) {
      try {
        const parts = JSON.parse(quote.parts_data);
        totalAmount += parts.reduce((sum: number, part: any) => sum + (part.total || 0), 0);
      } catch (e) {
        console.error('Error parsing parts data:', e);
      }
    }

    const quoteWithAmount = {
      ...quote,
      total_amount: totalAmount
    };

    const { data, error } = await supabase
      .from('quotes')
      .insert([quoteWithAmount])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating quote:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, quote: UpdateQuote) => {
    // Calculer le montant total à partir des données de réparations et pièces
    let totalAmount = 0;
    
    if (quote.repairs_data) {
      try {
        const repairs = JSON.parse(quote.repairs_data);
        totalAmount += repairs.reduce((sum: number, repair: any) => sum + (repair.total || 0), 0);
      } catch (e) {
        console.error('Error parsing repairs data:', e);
      }
    }
    
    if (quote.parts_data) {
      try {
        const parts = JSON.parse(quote.parts_data);
        totalAmount += parts.reduce((sum: number, part: any) => sum + (part.total || 0), 0);
      } catch (e) {
        console.error('Error parsing parts data:', e);
      }
    }

    const quoteWithAmount = {
      ...quote,
      total_amount: totalAmount
    };

    const { data, error } = await supabase
      .from('quotes')
      .update(quoteWithAmount)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating quote with id ${id}:`, error);
      throw new Error(error.message);
    }
    
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
