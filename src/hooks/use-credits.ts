
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { creditsService, Credit } from '@/services/supabase/credits';

export function useCredits() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    data: credits = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['credits'],
    queryFn: creditsService.getCredits,
    retry: false,
    staleTime: 1000 * 60 * 5
  });
  
  const createCredit = useMutation({
    mutationFn: creditsService.createCredit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast({
        title: "Avoir créé",
        description: "L'avoir a été créé avec succès.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating credit - Full error object:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      console.error('Error details:', error?.details);
      
      if (error?.code === '42P01') {
        toast({
          title: "Table manquante",
          description: "La table des avoirs n'existe pas encore. Veuillez exécuter les migrations de base de données.",
          variant: "destructive"
        });
      } else if (error?.message) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de créer l'avoir. Vérifiez la console pour plus de détails.",
          variant: "destructive"
        });
      }
    }
  });
  
  const updateCredit = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => 
      creditsService.updateCredit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast({
        title: "Avoir modifié",
        description: "L'avoir a été modifié avec succès.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating credit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'avoir.",
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
        description: "L'avoir a été supprimé avec succès.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting credit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'avoir.",
        variant: "destructive"
      });
    }
  });

  const generateReference = useQuery({
    queryKey: ['credits', 'generate-reference'],
    queryFn: creditsService.generateReference,
    enabled: false,
    retry: false
  });
  
  return {
    credits,
    isLoading,
    error,
    createCredit,
    updateCredit,
    deleteCredit,
    generateReference
  };
}

export function useCredit(id?: string) {
  const {
    data: credit,
    isLoading,
    error
  } = useQuery({
    queryKey: ['credits', id],
    queryFn: () => creditsService.getCredit(id!),
    enabled: !!id,
    retry: false
  });
  
  return {
    credit,
    isLoading,
    error
  };
}
