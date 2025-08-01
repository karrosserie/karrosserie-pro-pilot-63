import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { importsService } from '@/services/supabase/imports';
import { supabase } from '@/integrations/supabase/client';

export function useImports() {
  const queryClient = useQueryClient();
  
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

  // Mise à jour en temps réel des imports
  useEffect(() => {
    const channel = supabase
      .channel('imports-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'imports'
        },
        (payload) => {
          console.log('Import updated:', payload);
          // Invalider les données pour forcer un refetch
          queryClient.invalidateQueries({ queryKey: ['imports'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  return {
    pendingImports,
    isLoading,
    error
  };
}