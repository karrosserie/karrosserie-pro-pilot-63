
import { useQuery } from '@tanstack/react-query';
import { carModelsService } from '@/services/supabase/car-models';

export function useCarModels(brandId?: string) {
  console.log('useCarModels - Hook called with brandId:', brandId);
  
  const {
    data: carModels,
    isLoading,
    error
  } = useQuery({
    queryKey: ['car-models', brandId],
    queryFn: async () => {
      console.log('useCarModels - QueryFn executing with brandId:', brandId);
      if (!brandId) {
        console.log('useCarModels - No brandId provided, returning empty array');
        return [];
      }
      const result = await carModelsService.getByBrandId(brandId);
      console.log('useCarModels - Service returned:', result);
      return result;
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  console.log('useCarModels - Final return values:');
  console.log('  - brandId:', brandId);
  console.log('  - carModels:', carModels);
  console.log('  - isLoading:', isLoading);
  console.log('  - error:', error);
  
  return {
    carModels: carModels || [],
    isLoading,
    error
  };
}
