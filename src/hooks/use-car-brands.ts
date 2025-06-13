
import { useQuery } from '@tanstack/react-query';
import { carBrandsService } from '@/services/supabase/car-brands';

export function useCarBrands() {
  console.log('useCarBrands - Hook called');
  
  const {
    data: carBrands,
    isLoading,
    error
  } = useQuery({
    queryKey: ['car-brands'],
    queryFn: async () => {
      console.log('useCarBrands - QueryFn executing');
      const result = await carBrandsService.getAll();
      console.log('useCarBrands - Service returned:', result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  console.log('useCarBrands - Final return values:');
  console.log('  - carBrands:', carBrands);
  console.log('  - isLoading:', isLoading);
  console.log('  - error:', error);
  
  return {
    carBrands: carBrands || [],
    isLoading,
    error
  };
}
