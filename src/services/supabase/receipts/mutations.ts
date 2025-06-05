
import { supabase } from '@/integrations/supabase/client';
import { NewReceipt, UpdateReceipt } from './types';

export const receiptMutations = {
  create: async (receipt: Omit<NewReceipt, 'user_id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const receiptWithUser = {
      ...receipt,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('receipts')
      .insert([receiptWithUser])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating receipt:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, receipt: UpdateReceipt) => {
    const { data, error } = await supabase
      .from('receipts')
      .update(receipt)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating receipt with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('receipts')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting receipt with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};
