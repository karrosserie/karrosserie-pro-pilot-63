
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExpenses, getExpenseById } from '@/services/supabase/expenses/queries';
import { createExpense, updateExpense, deleteExpense } from '@/services/supabase/expenses/mutations';
import { NewExpense, UpdateExpense } from '@/services/supabase/expenses/types';
import { useToast } from '@/hooks/use-toast';

export function useExpenses() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: expenses,
    isLoading,
    error
  } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses
  });
  
  const createExpenseMutation = useMutation({
    mutationFn: (newExpense: NewExpense) => createExpense(newExpense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Dépense créée",
        description: "La dépense a été créée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer la dépense: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateExpense }) => 
      updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Dépense mise à jour",
        description: "La dépense a été mise à jour avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour la dépense: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la dépense: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  return {
    expenses,
    isLoading,
    error,
    createExpense: createExpenseMutation,
    updateExpense: updateExpenseMutation,
    deleteExpense: deleteExpenseMutation
  };
}

export function useExpense(id?: string) {
  const {
    data: expense,
    isLoading,
    error
  } = useQuery({
    queryKey: ['expenses', id],
    queryFn: () => id ? getExpenseById(id) : null,
    enabled: !!id
  });
  
  return {
    expense,
    isLoading,
    error
  };
}
