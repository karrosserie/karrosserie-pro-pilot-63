
import { supabase } from '@/integrations/supabase/client';

export type CarBrand = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export const carBrandsService = {
  getAll: async (): Promise<CarBrand[]> => {
    console.log('carBrandsService.getAll - Starting query');
    
    const { data, error } = await supabase
      .from('car_brands')
      .select('*')
      .order('name');

    console.log('carBrandsService.getAll - Query result:');
    console.log('  - data:', data);
    console.log('  - error:', error);

    if (error) {
      console.error('Error fetching car brands:', error);
      throw new Error(error.message);
    }

    console.log('carBrandsService.getAll - Returning:', data || []);
    return data || [];
  }
};
