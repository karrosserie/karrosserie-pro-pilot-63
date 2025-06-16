
import { supabase } from '@/integrations/supabase/client';
import { CreditCreateData, CreditUpdateData } from './types';

export const createCredit = async (creditData: CreditCreateData) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('credits')
    .insert([{
      ...creditData,
      user_id: user.id
    }])
    .select(`
      *,
      clients(first_name, last_name),
      vehicles(
        id,
        license_plate,
        car_brands(id, name),
        car_models(id, name)
      )
    `)
    .single();

  if (error) {
    console.error('Error creating credit:', error);
    throw new Error(error.message);
  }

  return data;
};

export const updateCredit = async (id: string, creditData: CreditUpdateData) => {
  const { data, error } = await supabase
    .from('credits')
    .update(creditData)
    .eq('id', id)
    .select(`
      *,
      clients(first_name, last_name),
      vehicles(
        id,
        license_plate,
        car_brands(id, name),
        car_models(id, name)
      )
    `)
    .single();

  if (error) {
    console.error('Error updating credit:', error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteCredit = async (id: string) => {
  const { error } = await supabase
    .from('credits')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting credit:', error);
    throw new Error(error.message);
  }

  return true;
};

export const generateReference = async (): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('credits')
      .select('reference')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.warn('Error fetching last reference, generating default:', error);
      return '1';
    }

    if (data && data.length > 0) {
      const lastReference = data[0].reference;
      const lastNumber = parseInt(lastReference);
      
      if (!isNaN(lastNumber)) {
        return (lastNumber + 1).toString();
      }
    }

    return '1';
  } catch (error) {
    console.error('Error generating reference:', error);
    return '1';
  }
};
