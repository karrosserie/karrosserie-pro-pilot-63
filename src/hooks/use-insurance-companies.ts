
import { useQuery } from '@tanstack/react-query';
import { insuranceCompaniesService } from '@/services/supabase/insurance-companies';

export function useInsuranceCompanies() {
  const {
    data: insuranceCompanies,
    isLoading,
    error
  } = useQuery({
    queryKey: ['insurance-companies'],
    queryFn: insuranceCompaniesService.getAll
  });
  
  return {
    insuranceCompanies: insuranceCompanies || [],
    isLoading,
    error
  };
}
