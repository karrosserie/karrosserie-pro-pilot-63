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
    refetchInterval: (query) => {
      // Only poll when window is focused, and use 15s interval instead of 5s
      return document.hasFocus() ? 15000 : false;
    },
    staleTime: 10000, // Consider data fresh for 10 seconds to reduce refetches
    refetchOnWindowFocus: true,
  });
  
  return {
    pendingImports,
    isLoading,
    error
  };
}