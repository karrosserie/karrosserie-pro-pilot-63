
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import { accountsService, Account } from '@/services/supabase/accounts';
import { useImpersonation } from '@/hooks/use-impersonation';
import { useEffect } from 'react';

export const useAccounts = () => {
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const queryClient = useQueryClient();
  const { isImpersonating, impersonationData } = useImpersonation();

  // Invalider les requêtes lors du changement d'impersonation
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['accounts'] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImpersonating, impersonationData?.company_id]);

  // Fetch accounts
  const {
    data: accounts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['accounts', impersonationData?.company_id || 'normal'],
    queryFn: accountsService.getAll,
    retry: (failureCount, error: any) => {
      // Don't retry authentication errors
      if (error?.message?.includes('not authenticated')) return false;
      // Don't retry if it's a table not found error
      if (error?.code === '42P01') return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false
  });

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
        description: error.message || "Une erreur est survenue lors de la création du compte.",
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
        description: error.message || "Une erreur est survenue lors de la modification du compte.",
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
        description: error.message || "Une erreur est survenue lors de la suppression du compte.",
        variant: "destructive"
      });
    },
  });

  const handleDelete = async (account: Account) => {
    const confirmed = await confirm({
      title: 'Supprimer le compte',
      description: `Êtes-vous sûr de vouloir supprimer le compte ${account.name} ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      deleteAccountMutation.mutate(account.id);
    }
  };

  const handleSync = (account: Account) => {
    // Mettre à jour le champ last_sync
    updateAccountMutation.mutate({
      id: account.id,
      updates: {
        last_sync: new Date().toISOString()
      }
    });
    
    toast({
      title: "Synchronisation",
      description: `Synchronisation du compte ${account.name} terminée.`
    });
  };

  const filterAccounts = (accounts: Account[], searchTerm: string) => {
    if (!searchTerm.trim()) return accounts;
    
    return accounts.filter(account => 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.iban.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type?.toLowerCase().includes(searchTerm.toLowerCase())
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
