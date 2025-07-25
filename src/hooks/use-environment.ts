import { useQuery } from '@tanstack/react-query';
import { environmentService } from '@/services/supabase/environment';

export function useEnvironment() {
  const {
    data: settings,
    isLoading,
    error
  } = useQuery({
    queryKey: ['environment'],
    queryFn: environmentService.getSettings
  });
  
  return {
    settings,
    isLoading,
    error
  };
}