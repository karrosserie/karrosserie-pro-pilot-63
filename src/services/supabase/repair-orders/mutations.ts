
import { supabase } from '@/integrations/supabase/client';
import { NewRepairOrder, UpdateRepairOrder } from './types';

export const createRepairOrder = async (order: NewRepairOrder) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const orderWithUser = {
    ...order,
    user_id: user.id
  };

  const { data, error } = await supabase
    .from('repair_orders')
    .insert([orderWithUser])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating repair order:', error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateRepairOrder = async (id: string, order: UpdateRepairOrder) => {
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
};

export const deleteRepairOrder = async (id: string) => {
  const { error } = await supabase
    .from('repair_orders')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting repair order with id ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};
