
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditsService } from '@/services/supabase/credits';
import { useToast } from '@/hooks/use-toast';

export function useCredits(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: credits,
    isLoading,
    error
  } = useQuery({
    queryKey: ['credits'],
    queryFn: creditsService.getCredits,
    staleTime: 30000,
    enabled // Désactive le fetch si false
  });

  const createCredit = useMutation({
    mutationFn: creditsService.createCredit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast({
        title: "Avoir créé",
        description: "L'avoir a été créé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer l'avoir: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateCredit = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => 
      creditsService.updateCredit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast({
        title: "Avoir mis à jour",
        description: "L'avoir a été mis à jour avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour l'avoir: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteCredit = useMutation({
    mutationFn: creditsService.deleteCredit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast({
        title: "Avoir supprimé",
        description: "L'avoir a été supprimé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer l'avoir: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const archiveCredit = useMutation({
    mutationFn: creditsService.archiveCredit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast({
        title: "Avoir archivé",
        description: "L'avoir a été archivé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible d'archiver l'avoir: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const restoreCredit = useMutation({
    mutationFn: creditsService.restoreCredit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast({
        title: "Avoir restauré",
        description: "L'avoir a été restauré avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de restaurer l'avoir: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  return {
    credits,
    isLoading,
    error,
    createCredit,
    updateCredit,
    deleteCredit,
    archiveCredit,
    restoreCredit
  };
}
