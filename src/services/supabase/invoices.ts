
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type NewInvoice = Database['public']['Tables']['invoices']['Insert'];
export type UpdateInvoice = Database['public']['Tables']['invoices']['Update'];

export const invoicesService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients(first_name, last_name),
        vehicles(brand, model, license_plate),
        repair_orders(reference)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients(id, first_name, last_name),
        vehicles(id, brand, model, license_plate),
        repair_orders(id, reference)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching invoice with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  create: async (invoice: NewInvoice) => {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoice])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating invoice:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, invoice: UpdateInvoice) => {
    const { data, error } = await supabase
      .from('invoices')
      .update(invoice)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating invoice with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting invoice with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};
