
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { receiptsService, ReceiptWithClient } from '@/services/supabase/receipts';
import { useToast } from '@/hooks/use-toast';

export function useReceiptsData() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: receiptsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['receipts'],
    queryFn: receiptsService.getAll
  });

  // Transform receipts data to include client names and invoice references
  const receipts: ReceiptWithClient[] = receiptsData?.map(receipt => {
    let clientName = 'Client non assigné';
    let invoiceRef = receipt.invoice_id || '';

    if (receipt.invoices) {
      invoiceRef = receipt.invoices.reference;
      // We'll need to get client data separately for now
    }

    return {
      ...receipt,
      client: clientName,
      invoice: invoiceRef
    };
  }) || [];
  
  const createReceipt = useMutation({
    mutationFn: (newReceipt: Omit<Parameters<typeof receiptsService.create>[0], 'user_id'>) => 
      receiptsService.create(newReceipt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
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

  const handleDelete = (receipt: ReceiptWithClient) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'encaissement ${receipt.reference || 'sans référence'} ?`)) {
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
