
import { useQuery } from '@tanstack/react-query';
import { carBrandsService } from '@/services/supabase/car-brands';

export function useCarBrands() {
  const {
    data: carBrands,
    isLoading,
    error
  } = useQuery({
    queryKey: ['car-brands'],
    queryFn: carBrandsService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  console.log('useCarBrands - fetched data:', carBrands);
  
  return {
    carBrands: carBrands || [],
    isLoading,
    error
  };
}
