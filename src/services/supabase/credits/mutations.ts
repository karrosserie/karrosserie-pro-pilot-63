
import { supabase } from '@/integrations/supabase/client';
import { Credit, CreditCreateData, CreditUpdateData } from './types';
import { ensureCreditsTableExists } from './table-utils';

export const createCredit = async (creditData: CreditCreateData): Promise<Credit> => {
  console.log('Creating credit with data:', creditData);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
  }

  console.log('User authenticated:', user.id);

  // Ensure the credits table exists
  await ensureCreditsTableExists();

  const insertData = {
    user_id: user.id,
    reference: creditData.reference,
    invoice_id: creditData.invoice_id,
    status: creditData.status,
    amount: creditData.amount,
    items_data: creditData.items_data,
    notes: creditData.notes
  };

  console.log('Inserting data:', insertData);

  try {
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
        throw new Error('La table des avoirs n\'existe pas. Veuillez exécuter la migration 013_create_credits_table.sql dans votre dashboard Supabase.');
      }
      
      throw new Error(`Failed to create credit: ${error.message || 'Unknown error'}`);
    }

    console.log('Credit created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createCredit:', error);
    throw error;
  }
};

export const updateCredit = async (id: string, creditData: CreditUpdateData): Promise<Credit> => {
  const { data, error } = await (supabase as any)
    .from('credits')
    .update(creditData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Update credit error:', error);
    throw new Error(`Failed to update credit: ${error.message || 'Unknown error'}`);
  }
  return data;
};

export const deleteCredit = async (id: string): Promise<boolean> => {
  const { error } = await (supabase as any)
    .from('credits')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete credit error:', error);
    throw new Error(`Failed to delete credit: ${error.message || 'Unknown error'}`);
  }
  return true;
};
