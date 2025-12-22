import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { importsService } from '@/services/supabase/imports';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useImports() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const deleteImport = useMutation({
    mutationFn: async (importId: string) => {
      const { error } = await supabase
        .from('imports')
        .delete()
        .eq('id', importId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imports'] });
      toast({
        title: 'Import supprimé',
        description: 'L\'import en cours d\'analyse a été supprimé.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: `Impossible de supprimer l'import: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  return {
    pendingImports: pendingImports || [],
    isLoading,
    error,
    deleteImport,
  };
}