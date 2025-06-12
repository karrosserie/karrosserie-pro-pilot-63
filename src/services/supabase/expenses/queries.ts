
import { supabase } from '@/integrations/supabase/client';
import { ExpenseWithRelations } from './types';

export const getExpenses = async (): Promise<ExpenseWithRelations[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      vehicle:vehicles(
        id,
        license_plate,
        car_brands(name),
        car_models(name)
      )
    `)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }

  return data || [];
};

export const getExpenseById = async (id: string): Promise<ExpenseWithRelations | null> => {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      vehicle:vehicles(
        id,
        license_plate,
        car_brands(name),
        car_models(name)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching expense:', error);
    throw error;
  }

  return data;
};
