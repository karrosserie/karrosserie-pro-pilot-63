
import { supabase } from '@/integrations/supabase/client';
import { NewInvoice, UpdateInvoice } from './types';

export const invoiceMutations = {
  create: async (invoice: NewInvoice) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const invoiceWithUser = {
      ...invoice,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('invoices')
      .insert([invoiceWithUser])
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
