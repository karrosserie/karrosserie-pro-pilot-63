
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditsService, NewCredit, UpdateCredit } from '@/services/supabase/credits';
import { useToast } from '@/hooks/use-toast';

export function useCredits() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: credits,
    isLoading,
    error
  } = useQuery({
    queryKey: ['credits'],
    queryFn: creditsService.getAll
  });
  
  const createCredit = useMutation({
    mutationFn: (newCredit: NewCredit) => creditsService.create(newCredit),
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
    mutationFn: ({ id, data }: { id: string, data: UpdateCredit }) => 
      creditsService.update(id, data),
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
    mutationFn: (id: string) => creditsService.delete(id),
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
  
  return {
    credits,
    isLoading,
    error,
    createCredit,
    updateCredit,
    deleteCredit
  };
}

export function useCredit(id?: string) {
  const {
    data: credit,
    isLoading,
    error
  } = useQuery({
    queryKey: ['credits', id],
    queryFn: () => id ? creditsService.getById(id) : null,
    enabled: !!id
  });
  
  return {
    credit,
    isLoading,
    error
  };
}
