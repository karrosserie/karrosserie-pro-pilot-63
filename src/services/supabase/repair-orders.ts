
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type RepairOrder = Database['public']['Tables']['repair_orders']['Row'];
export type NewRepairOrder = Database['public']['Tables']['repair_orders']['Insert'];
export type UpdateRepairOrder = Database['public']['Tables']['repair_orders']['Update'];

export const repairOrdersService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('repair_orders')
      .select(`
        *,
        clients(first_name, last_name),
        vehicles(brand, model, license_plate),
        quotes(reference, amount)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching repair orders:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('repair_orders')
      .select(`
        *,
        clients(id, first_name, last_name),
        vehicles(id, brand, model, license_plate),
        quotes(id, reference, amount)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching repair order with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  create: async (order: NewRepairOrder) => {
    const { data, error } = await supabase
      .from('repair_orders')
      .insert([order])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating repair order:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, order: UpdateRepairOrder) => {
    const { data, error } = await supabase
      .from('repair_orders')
      .update(order)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating repair order with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('repair_orders')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting repair order with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};
