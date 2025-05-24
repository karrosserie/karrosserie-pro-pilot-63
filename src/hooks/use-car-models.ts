
import { useQuery } from '@tanstack/react-query';
import { carModelsService } from '@/services/supabase/car-models';

export function useCarModels(brandId?: string) {
  const {
    data: carModels,
    isLoading,
    error
  } = useQuery({
    queryKey: ['car-models', brandId],
    queryFn: () => brandId ? carModelsService.getByBrandId(brandId) : [],
    enabled: !!brandId
  });
  
  return {
    carModels: carModels || [],
    isLoading,
    error
  };
}
