
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
        brand,
        model
      )
    `)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }

  // Map the data to include the status field
  return (data || []).map(expense => ({
    ...expense,
    status: expense.status || 'En attente' // Default status if not present
  }));
};

export const getExpenseById = async (id: string): Promise<ExpenseWithRelations | null> => {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      vehicle:vehicles(
        id,
        license_plate,
        brand,
        model
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching expense:', error);
    throw error;
  }

  if (!data) return null;

  // Add status field to the returned expense
  return {
    ...data,
    status: data.status || 'En attente' // Default status if not present
  };
};
