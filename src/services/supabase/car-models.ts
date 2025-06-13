
import { supabase } from '@/integrations/supabase/client';

export type CarModel = {
  id: string;
  brand_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export const carModelsService = {
  getByBrandId: async (brandId: string): Promise<CarModel[]> => {
    const { data, error } = await supabase
      .from('car_models')
      .select('*')
      .eq('brand_id', brandId)
      .order('name');

    if (error) {
      console.error('Error fetching car models:', error);
      throw new Error(error.message);
    }

    return data || [];
  }
};
