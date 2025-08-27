
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { receiptsService, ReceiptWithClient } from '@/services/supabase/receipts';
import { demoService, DEMO_MODE } from '@/services/demoService';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';

export function useReceiptsData() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  
  const {
    data: receiptsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['receipts'],
    queryFn: async () => {
      if (DEMO_MODE) {
        // Simuler des reçus avec le format attendu
        return [
          {
            id: '1',
            date: new Date().toISOString(),
            amount: 1500,
            status: 'Encaissé',
            reference: 'ENC-001',
            invoice_id: 'invoice-2',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            company_id: '00000000-0000-4000-8000-000000000002',
            invoices: {
              reference: 'FAC-2024-002'
            }
          },
          {
            id: '2', 
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 890,
            status: 'Encaissé',
            reference: 'ENC-002',
            invoice_id: 'invoice-1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            company_id: '00000000-0000-4000-8000-000000000002',
            invoices: {
              reference: 'FAC-2024-001'
            }
          }
        ];
      }
      return receiptsService.getAll();
    }
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
