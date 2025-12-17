
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { invoicesService } from '@/services/supabase/invoices';
import { useImpersonation } from '@/hooks/use-impersonation';
import { userActionWebhookService } from '@/services/tracking/UserActionWebhookService';
import { useDetailedTracking } from '@/hooks/tracking/useDetailedTracking';

// Hook sans paramètre - retourne TOUTES les factures, filtrage côté client
export function useInvoices() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isImpersonating, impersonationData } = useImpersonation();
  const { trackAction } = useDetailedTracking();

  // L'impersonation est gérée via la queryKey dynamique - plus besoin d'invalider manuellement

  // QueryKey STABLE - plus de paramètre showArchived
  const {
    data: invoices,
    isLoading,
    error
  } = useQuery({
    queryKey: ['invoices', impersonationData?.company_id || 'normal'],
    queryFn: async () => {
      // Récupère TOUTES les factures (archived et non-archived)
      return await invoicesService.getAll();
    },
    staleTime: 10000
  });

  const createInvoice = useMutation({
    mutationFn: async (invoiceData: any) => {
      return await invoicesService.create(invoiceData);
    },
    onSuccess: (data) => {
      // Invalidation immédiate comme use-quotes.ts
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      
      toast({
        title: "Facture créée",
        description: "La facture a été créée avec succès."
      });
      
      userActionWebhookService.sendUserAction('creation_facture', {
        invoice_id: data?.id,
        invoice_reference: data?.reference
      });
      
      trackAction('invoice_created', {
        invoice_id: data?.id,
        invoice_reference: data?.reference,
        client_id: data?.client_id,
        vehicle_id: data?.vehicle_id,
        amount: data?.amount
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer la facture: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateInvoice = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      return await invoicesService.update(id, data);
    },
    onSuccess: (updatedInvoice, { id }) => {
      // Invalidation unique comme use-quotes.ts
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      
      toast({
        title: "Facture mise à jour",
        description: "La facture a été mise à jour avec succès."
      });
      
      trackAction('invoice_updated', {
        invoice_id: id,
        invoice_reference: updatedInvoice?.reference
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour la facture: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteInvoice = useMutation({
    mutationFn: async (id: string) => {
      return await invoicesService.delete(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      
      toast({
        title: "Facture supprimée",
        description: "La facture a été supprimée avec succès."
      });
      
      trackAction('invoice_deleted', {
        invoice_id: id
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la facture: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const archiveInvoice = useMutation({
    mutationFn: async (id: string) => {
      return await invoicesService.archive(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      
      toast({
        title: "Facture archivée",
        description: "La facture a été archivée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible d'archiver la facture: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const restoreInvoice = useMutation({
    mutationFn: async (id: string) => {
      return await invoicesService.restore(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      
      toast({
        title: "Facture restaurée",
        description: "La facture a été restaurée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de restaurer la facture: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  return {
    invoices,
    isLoading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    archiveInvoice,
    restoreInvoice
  };
}
