
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { receiptsService, ReceiptWithClient } from '@/services/supabase/receipts';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import { useImpersonation } from '@/hooks/use-impersonation';
import { useEffect, useMemo } from 'react';

export function useReceiptsData() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const { isImpersonating, impersonationData } = useImpersonation();

  // Invalider les requêtes lors du changement d'impersonation
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['receipts'] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImpersonating, impersonationData?.company_id]);
  
  const {
    data: receiptsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['receipts', impersonationData?.company_id || 'normal'],
    queryFn: receiptsService.getAll,
    staleTime: 5000 // 5 secondes avant de considérer les données comme obsolètes
  });

  // Transform receipts data to include client names and invoice references - memoized
  const receipts: ReceiptWithClient[] = useMemo(() => {
    return receiptsData?.map(receipt => {
      let clientName = 'Client non assigné';
      let invoiceRef = receipt.invoice_id || '';

      if (receipt.invoices) {
        invoiceRef = receipt.invoices.reference;
      }

      return {
        ...receipt,
        client: clientName,
        invoice: invoiceRef
      };
    }) || [];
  }, [receiptsData]);
  
  const createReceipt = useMutation({
    mutationFn: (newReceipt: Omit<Parameters<typeof receiptsService.create>[0], 'company_id'>) => 
      receiptsService.create(newReceipt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Encaissement créé",
        description: "L'encaissement a été créé avec succès."
      });
    },
    onError: (error) => {
      console.error('Create receipt error:', error);
      toast({
        title: "Erreur",
        description: `Impossible de créer l'encaissement: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateReceipt = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Parameters<typeof receiptsService.update>[1] }) => 
      receiptsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Encaissement mis à jour",
        description: "L'encaissement a été mis à jour avec succès."
      });
    },
    onError: (error) => {
      console.error('Update receipt error:', error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour l'encaissement: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteReceipt = useMutation({
    mutationFn: (id: string) => receiptsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Encaissement supprimé",
        description: "L'encaissement a été supprimé avec succès."
      });
    },
    onError: (error) => {
      console.error('Delete receipt error:', error);
      toast({
        title: "Erreur",
        description: `Impossible de supprimer l'encaissement: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleDelete = async (receipt: ReceiptWithClient) => {
    const confirmed = await confirm({
      title: 'Supprimer l\'encaissement',
      description: `Êtes-vous sûr de vouloir supprimer l'encaissement ${receipt.reference || 'sans référence'} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      deleteReceipt.mutate(receipt.id);
    }
  };

  const filterReceipts = (receipts: ReceiptWithClient[], searchTerm: string) => {
    return receipts.filter(receipt => 
      (receipt.reference && receipt.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (receipt.client && receipt.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (receipt.invoice && receipt.invoice.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  return {
    receipts,
    isLoading,
    error,
    createReceipt,
    updateReceipt,
    deleteReceipt,
    handleDelete,
    filterReceipts
  };
}

export function useReceipt(id?: string) {
  const {
    data: receipt,
    isLoading,
    error
  } = useQuery({
    queryKey: ['receipts', id],
    queryFn: () => id ? receiptsService.getById(id) : null,
    enabled: !!id
  });
  
  return {
    receipt,
    isLoading,
    error
  };
}
