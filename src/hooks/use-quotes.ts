
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quotesService, NewQuote, UpdateQuote } from '@/services/supabase/quotes';
import { useToast } from '@/hooks/use-toast';

export function useQuotes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: quotes,
    isLoading,
    error
  } = useQuery({
    queryKey: ['quotes'],
    queryFn: quotesService.getAll
  });
  
  const createQuote = useMutation({
    mutationFn: (newQuote: NewQuote) => quotesService.create(newQuote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: "Devis créé",
        description: "Le devis a été créé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer le devis: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateQuote = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateQuote }) => 
      quotesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: "Devis mis à jour",
        description: "Le devis a été mis à jour avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le devis: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteQuote = useMutation({
    mutationFn: (id: string) => quotesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: "Devis supprimé",
        description: "Le devis a été supprimé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le devis: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  return {
    quotes,
    isLoading,
    error,
    createQuote,
    updateQuote,
    deleteQuote
  };
}

export function useQuote(id?: string) {
  const {
    data: quote,
    isLoading,
    error
  } = useQuery({
    queryKey: ['quotes', id],
    queryFn: () => id ? quotesService.getById(id) : null,
    enabled: !!id
  });
  
  return {
    quote,
    isLoading,
    error
  };
}
