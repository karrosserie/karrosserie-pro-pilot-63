
import { supabase } from '@/integrations/supabase/client';
import { Credit, CreditCreateData, CreditUpdateData } from './types';
import { getCurrentUserCompanyId } from '../auth-company';

export const createCredit = async (creditData: CreditCreateData): Promise<Credit> => {
  console.log('Creating credit with data:', creditData);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
  }

  console.log('User authenticated:', user.id);

  const companyId = await getCurrentUserCompanyId();

  const insertData = {
    company_id: companyId,
    reference: creditData.reference,
    invoice_id: creditData.invoice_id,
    status: creditData.status,
    amount: creditData.amount,
    items_data: creditData.items_data,
    notes: creditData.notes
  };

  console.log('Inserting data:', insertData);

  try {
    // Test if table exists first
    const { error: testError } = await (supabase as any)
      .from('credits')
      .select('id')
      .limit(1);

    if (testError && testError.code === '42P01') {
      throw new Error('TABLE_MISSING');
    }

    // Use any to bypass TypeScript errors for missing table type
    const { data, error } = await (supabase as any)
      .from('credits')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      
      if (error.code === '42P01') {
        throw new Error('TABLE_MISSING');
      }
      
      throw new Error(`Failed to create credit: ${error.message || 'Unknown error'}`);
    }

    console.log('Credit created successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Error in createCredit:', error);
    
    if (error.message === 'TABLE_MISSING') {
      throw new Error('La table des avoirs n\'existe pas. Veuillez exécuter la migration SQL dans votre dashboard Supabase.');
    }
    
    throw error;
  }
};

export const updateCredit = async (id: string, creditData: CreditUpdateData): Promise<Credit> => {
  try {
    // Test if table exists first
    const { error: testError } = await (supabase as any)
      .from('credits')
      .select('id')
      .limit(1);

    if (testError && testError.code === '42P01') {
      throw new Error('TABLE_MISSING');
    }

    const { data, error } = await (supabase as any)
      .from('credits')
      .update(creditData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update credit error:', error);
      if (error.code === '42P01') {
        throw new Error('TABLE_MISSING');
      }
      throw new Error(`Failed to update credit: ${error.message || 'Unknown error'}`);
    }
    return data;
  } catch (error: any) {
    if (error.message === 'TABLE_MISSING') {
      throw new Error('La table des avoirs n\'existe pas. Veuillez exécuter la migration SQL dans votre dashboard Supabase.');
    }
    throw error;
  }
};

export const deleteCredit = async (id: string): Promise<boolean> => {
  try {
    // Test if table exists first
    const { error: testError } = await (supabase as any)
      .from('credits')
      .select('id')
      .limit(1);

    if (testError && testError.code === '42P01') {
      throw new Error('TABLE_MISSING');
    }

    const { error } = await (supabase as any)
      .from('credits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete credit error:', error);
      if (error.code === '42P01') {
        throw new Error('TABLE_MISSING');
      }
      throw new Error(`Failed to delete credit: ${error.message || 'Unknown error'}`);
    }
    return true;
  } catch (error: any) {
    if (error.message === 'TABLE_MISSING') {
      throw new Error('La table des avoirs n\'existe pas. Veuillez exécuter la migration SQL dans votre dashboard Supabase.');
    }
    throw error;
  }
};
