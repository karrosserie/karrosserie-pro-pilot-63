import { supabase } from '@/integrations/supabase/client';

export type AutomotivePart = {
  id: string;
  name: string;
  category: 'fourniture' | 'piece_carrosserie';
  subcategory: string | null;
  created_at: string;
  updated_at: string;
};

export const automotivePartsService = {
  getAll: async (): Promise<AutomotivePart[]> => {
    const { data, error } = await supabase
      .from('automotive_parts')
      .select('*')
      .order('name');

    if (error) throw new Error(error.message);
    return (data || []) as AutomotivePart[];
  },

  getByCategory: async (category: 'fourniture' | 'piece_carrosserie'): Promise<AutomotivePart[]> => {
    const { data, error } = await supabase
      .from('automotive_parts')
      .select('*')
      .eq('category', category)
      .order('name');

    if (error) throw new Error(error.message);
    return (data || []) as AutomotivePart[];
  },

  getPartNames: async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from('automotive_parts')
      .select('name')
      .order('name');

    if (error) throw new Error(error.message);
    return data?.map(p => p.name) || [];
  }
};
