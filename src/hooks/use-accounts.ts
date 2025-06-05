import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { accountsService, Account } from '@/services/supabase/accounts';

export const useAccounts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch accounts
  const {
    data: accounts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsService.getAll,
    retry: 1,
  });

  // Handle errors manually
  if (error) {
    console.error('Error fetching accounts:', error);
    const errorMessage = error as any;
    if (errorMessage.code === '42P01') {
      console.log('Table accounts does not exist yet - using mock service');
    }
  }

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: accountsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: "Compte créé",
        description: "Le nouveau compte a été créé avec succès."
      });
    },
    onError: (error: any) => {
      console.error('Error creating account:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du compte.",
        variant: "destructive"
      });
    },
  });

  // Update account mutation
  const updateAccountMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      accountsService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: "Compte modifié",
        description: "Le compte a été modifié avec succès."
      });
    },
    onError: (error: any) => {
      console.error('Error updating account:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du compte.",
        variant: "destructive"
      });
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: accountsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: "Compte supprimé",
        description: "Le compte a été supprimé avec succès."
      });
    },
    onError: (error: any) => {
      console.error('Error deleting account:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du compte.",
        variant: "destructive"
      });
    },
  });

  const handleDelete = (account: Account) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le compte ${account.name} ?`)) {
      deleteAccountMutation.mutate(account.id);
    }
  };

  const handleSync = (account: Account) => {
    toast({
      title: "Synchronisation",
      description: `Synchronisation du compte ${account.name} en cours...`
    });
  };

  const filterAccounts = (accounts: Account[], searchTerm: string) => {
    return accounts.filter(account => 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.bank.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    accounts,
    isLoading,
    error,
    handleDelete,
    handleSync,
    filterAccounts,
    createAccount: createAccountMutation.mutate,
    updateAccount: updateAccountMutation.mutate,
    isCreating: createAccountMutation.isPending,
    isUpdating: updateAccountMutation.isPending,
    isDeleting: deleteAccountMutation.isPending,
  };
};
