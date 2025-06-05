
import { supabase } from '@/integrations/supabase/client';
import { NewExpense, UpdateExpense } from './types';

export const createExpense = async (expense: NewExpense) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select()
    .single();

  if (error) {
    console.error('Error creating expense:', error);
    throw error;
  }

  return data;
};

export const updateExpense = async (id: string, updates: UpdateExpense) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating expense:', error);
    throw error;
  }

  return data;
};

export const deleteExpense = async (id: string) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};
