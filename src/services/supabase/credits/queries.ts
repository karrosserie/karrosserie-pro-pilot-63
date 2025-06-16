
import { supabase } from '@/integrations/supabase/client';
import { Credit } from './types';

export const getCredits = async (): Promise<Credit[]> => {
  const { data, error } = await supabase
    .from('credits')
    .select(`
      *,
      clients(id, first_name, last_name),
      vehicles(
        id,
        license_plate,
        car_brands(id, name),
        car_models(id, name)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching credits:', error);
    throw new Error(error.message);
  }

  return data;
};

export const getCreditById = async (id: string): Promise<Credit | null> => {
  const { data, error } = await supabase
    .from('credits')
    .select(`
      *,
      clients(id, first_name, last_name),
      vehicles(
        id,
        license_plate,
        car_brands(id, name),
        car_models(id, name)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching credit:', error);
    throw new Error(error.message);
  }

  return data;
};

export const getLastCreditByUser = async (): Promise<Credit | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('credits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Aucun crédit trouvé
      return null;
    }
    console.error('Error fetching last credit:', error);
    throw new Error(error.message);
  }

  return data;
};
