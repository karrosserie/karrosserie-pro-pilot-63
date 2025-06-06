
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cessionsService, NewCession, UpdateCession } from '@/services/supabase/cessions';
import { useToast } from '@/hooks/use-toast';

export function useCessions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: cessions,
    isLoading,
    error
  } = useQuery({
    queryKey: ['cessions'],
    queryFn: cessionsService.getAll
  });
  
  const createCession = useMutation({
    mutationFn: (newCession: Partial<NewCession>) => {
      // Ensure required fields are present
      const cessionData: NewCession = {
        reference: newCession.reference || '',
        buyer_name: newCession.buyer_name || '',
        sale_amount: newCession.sale_amount || 0,
        sale_date: newCession.sale_date || new Date().toISOString().split('T')[0],
        ...newCession
      } as NewCession;
      
      return cessionsService.create(cessionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cessions'] });
      toast({
        title: "Cession créée",
        description: "La cession a été créée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer la cession: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateCession = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateCession }) => 
      cessionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cessions'] });
      toast({
        title: "Cession mise à jour",
        description: "La cession a été mise à jour avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour la cession: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteCession = useMutation({
    mutationFn: (id: string) => cessionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cessions'] });
      toast({
        title: "Cession supprimée",
        description: "La cession a été supprimée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la cession: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  return {
    cessions,
    isLoading,
    error,
    createCession,
    updateCession,
    deleteCession
  };
}

export function useCession(id?: string) {
  const {
    data: cession,
    isLoading,
    error
  } = useQuery({
    queryKey: ['cessions', id],
    queryFn: () => id ? cessionsService.getById(id) : null,
    enabled: !!id
  });
  
  return {
    cession,
    isLoading,
    error
  };
}
