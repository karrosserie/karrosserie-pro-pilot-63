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
    refetchInterval: 5000, // Refresh every 5 seconds to track progress
    staleTime: 0, // Considérer les données comme obsolètes immédiatement
    refetchOnWindowFocus: true, // Refetch quand la fenêtre reprend le focus
  });

  // Temporairement désactivé - la fonctionnalité temps réel sera réimplémentée plus tard
  // useEffect(() => {
  //   const channel = supabase
  //     .channel('imports-realtime')
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: '*',
  //         schema: 'public',
  //         table: 'imports'
  //       },
  //       (payload) => {
  //         console.log('Import updated:', payload);
  //         queryClient.invalidateQueries({ queryKey: ['imports'] });
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [queryClient]);
  
  return {
    pendingImports,
    isLoading,
    error
  };
}