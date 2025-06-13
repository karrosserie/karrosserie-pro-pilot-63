
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
    console.log('carModelsService.getByBrandId - Starting query with brandId:', brandId);
    
    const { data, error } = await supabase
      .from('car_models')
      .select('*')
      .eq('brand_id', brandId)
      .order('name');

    console.log('carModelsService.getByBrandId - Query result:');
    console.log('  - brandId:', brandId);
    console.log('  - data:', data);
    console.log('  - error:', error);

    if (error) {
      console.error('Error fetching car models:', error);
      throw new Error(error.message);
    }

    console.log('carModelsService.getByBrandId - Returning:', data || []);
    return data || [];
  }
};
