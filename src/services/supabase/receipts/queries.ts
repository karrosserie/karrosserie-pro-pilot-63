
import { supabase } from '@/integrations/supabase/client';
import { Receipt } from './types';

export const receiptQueries = {
  getAll: async (): Promise<Receipt[]> => {
    console.log('Fetching receipts...');
    
    const { data: receiptsWithJoins, error: joinError } = await supabase
      .from('receipts')
      .select(`
        *,
        invoices (
          id,
          reference,
          amount,
          client_id
        )
      `)
      .order('created_at', { ascending: false });

    if (joinError) {
      console.log('Joins failed for receipts, falling back to basic query:', joinError);
      
      const { data: basicReceipts, error: basicError } = await supabase
        .from('receipts')
        .select('*')
        .order('created_at', { ascending: false });

      if (basicError) {
        console.error('Error fetching receipts (basic):', basicError);
        throw new Error(basicError.message);
      }

      return basicReceipts || [];
    }
    
    return receiptsWithJoins || [];
  },

  getById: async (id: string): Promise<Receipt> => {
    const { data, error } = await supabase
      .from('receipts')
      .select(`
        *,
        invoices (
          id,
          reference,
          amount,
          client_id
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching receipt with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },

  getLastReceiptByUser: async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      throw new Error('User not authenticated');
    }

    const { data: receipt, error } = await supabase
      .from('receipts')
      .select('reference')
      .eq('user_id', user.id)
      .order('reference', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching last receipt:', error);
      throw new Error(error.message);
    }

    return receipt;
  }
};
