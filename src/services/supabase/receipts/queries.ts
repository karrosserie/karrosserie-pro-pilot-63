
import { supabase } from '@/integrations/supabase/client';
import { Receipt } from './types';

export const receiptQueries = {
  getAll: async (): Promise<Receipt[]> => {
    console.log('Fetching receipts...');
    
    // Définir explicitement la company_id en mode impersonation
    const impersonationData = localStorage.getItem('admin_impersonation');
    if (impersonationData) {
      try {
        const data = JSON.parse(impersonationData);
        console.log('Using impersonation company_id for receipts:', data.company_id);
        await supabase.rpc('set_config' as any, {
          setting_name: 'app.impersonation_company_id',
          setting_value: data.company_id,
          is_local: true
        });
      } catch (error) {
        console.error('Error setting impersonation config for receipts:', error);
      }
    }
    
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

    const { data: userCompany } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', user.id)
      .eq('active', true)
      .single();

    if (!userCompany?.company_id) {
      throw new Error('No active company found');
    }

    const { data: receipt, error } = await supabase
      .from('receipts')
      .select('reference')
      .eq('company_id', userCompany.company_id)
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
