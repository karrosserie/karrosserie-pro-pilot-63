
import { useQuery } from '@tanstack/react-query';
import { carBrandsService } from '@/services/supabase/car-brands';

export function useCarBrands() {
  const {
    data: carBrands,
    isLoading,
    error
  } = useQuery({
    queryKey: ['car-brands'],
    queryFn: carBrandsService.getAll
  });
  
  return {
    carBrands: carBrands || [],
    isLoading,
    error
  };
}
