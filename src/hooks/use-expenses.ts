
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import { demoService, DEMO_MODE } from '@/services/demoService';
import { 
  getExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense,
  type Expense,
  type NewExpense,
  type UpdateExpense,
  type ExpenseWithRelations
} from '@/services/supabase/expenses';

export const useExpenses = () => {
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const queryClient = useQueryClient();

  const { 
    data: expenses = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      if (DEMO_MODE) {
        const { data } = await demoService.expenses.getAll();
        // Ajouter le champ total_amount qui correspond au champ amount
        return data?.map(expense => ({
          ...expense,
          total_amount: expense.amount,
          vehicle: null, // Pas de relation véhicule dans les données fictives pour l'instant
          supplier: expense.supplier || '',
          category: expense.category || '',
          type: expense.category || 'général'
        })) || [];
      }
      return getExpenses();
    }
  });

  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Dépense créée",
        description: "La nouvelle dépense a été créée avec succès."
      });
    },
    onError: (error) => {
      console.error('Error creating expense:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la dépense.",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateExpense }) =>
      updateExpense(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Dépense modifiée",
        description: "La dépense a été modifiée avec succès."
      });
    },
    onError: (error) => {
      console.error('Error updating expense:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de la dépense.",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès."
      });
    },
    onError: (error) => {
      console.error('Error deleting expense:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la dépense.",
        variant: "destructive"
      });
    }
  });

  const handleDelete = async (expense: ExpenseWithRelations) => {
    const confirmed = await confirm({
      title: 'Supprimer la dépense',
      description: 'Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      deleteMutation.mutate(expense.id);
    }
  };

  const filterExpenses = (expenses: ExpenseWithRelations[], searchTerm: string) => {
    return expenses.filter(expense => 
      expense.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    expenses,
    isLoading,
    error,
    handleDelete,
    filterExpenses,
    createExpense: createMutation.mutate,
    updateExpense: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
