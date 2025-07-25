import { useQuery } from '@tanstack/react-query';
import { importsService } from '@/services/supabase/imports';

export function useImports() {
  const {
    data: pendingImports,
    isLoading,
    error
  } = useQuery({
    queryKey: ['imports', 'pending'],
    queryFn: importsService.getPendingImports,
    refetchInterval: 5000 // Refresh every 5 seconds to track progress
  });
  
  return {
    pendingImports,
    isLoading,
    error
  };
}