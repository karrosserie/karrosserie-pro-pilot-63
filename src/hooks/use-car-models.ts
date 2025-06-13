
import { useQuery } from '@tanstack/react-query';
import { carModelsService } from '@/services/supabase/car-models';

export function useCarModels(brandId?: string) {
  const {
    data: carModels,
    isLoading,
    error
  } = useQuery({
    queryKey: ['car-models', brandId],
    queryFn: () => brandId ? carModelsService.getByBrandId(brandId) : Promise.resolve([]),
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  console.log('useCarModels - brandId:', brandId, 'fetched data:', carModels);
  
  return {
    carModels: carModels || [],
    isLoading,
    error
  };
}
