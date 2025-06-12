
import { supabase } from '@/integrations/supabase/client';

export type CarBrand = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export const carBrandsService = {
  getAll: async (): Promise<CarBrand[]> => {
    const { data, error } = await supabase
      .from('car_brands')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching car brands:', error);
      throw new Error(error.message);
    }

    return data || [];
  }
};
