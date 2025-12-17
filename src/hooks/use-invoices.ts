
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { invoicesService } from '@/services/supabase/invoices';
import { useImpersonation } from '@/hooks/use-impersonation';
import { useEffect, useCallback } from 'react';
import { userActionWebhookService } from '@/services/tracking/UserActionWebhookService';
import { useDetailedTracking } from '@/hooks/tracking/useDetailedTracking';

export function useInvoices(showArchived: boolean = false) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isImpersonating, impersonationData } = useImpersonation();
  const { trackAction } = useDetailedTracking();

  // Invalider les requêtes lors du changement d'impersonation
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['invoices'] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImpersonating, impersonationData?.company_id]);

  const {
    data: invoices,
    isLoading,
    error
  } = useQuery({
    queryKey: ['invoices', impersonationData?.company_id || 'normal', showArchived],
    queryFn: async () => {
      return await invoicesService.getAll(showArchived);
    },
    staleTime: 10000 // 10 secondes avant de considérer les données comme obsolètes
  });

  // Fonction utilitaire pour invalider les queries de manière contrôlée
  // Délai augmenté à 600ms pour laisser le dialog se fermer et se démonter complètement
  // avant de déclencher l'invalidation et le refetch
  const invalidateInvoiceQueries = useCallback((invoiceId?: string) => {
    const run = () => {
      // Invalider la liste principale
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      // Si un ID spécifique, invalider aussi cette query
      if (invoiceId) {
        queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] });
      }
    };

    // Utiliser un délai fixe de 600ms au lieu de requestIdleCallback
    // pour garantir que le dialog est complètement démonté avant l'invalidation
    setTimeout(run, 600);
  }, [queryClient]);

  const createInvoice = useMutation({
    mutationFn: async (invoiceData: any) => {
      return await invoicesService.create(invoiceData);
    },
    onSuccess: (data) => {
      invalidateInvoiceQueries();
      toast({
        title: "Facture créée",
        description: "La facture a été créée avec succès."
      });
      
      // Envoyer le webhook (existant)
      userActionWebhookService.sendUserAction('creation_facture', {
        invoice_id: data?.id,
        invoice_reference: data?.reference
      });
      
      // Track invoice creation (nouveau système)
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
      invalidateInvoiceQueries(id);
      toast({
        title: "Facture mise à jour",
        description: "La facture a été mise à jour avec succès."
      });
      
      // Track invoice update
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
      invalidateInvoiceQueries();
      toast({
        title: "Facture supprimée",
        description: "La facture a été supprimée avec succès."
      });
      
      // Track invoice deletion
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
      invalidateInvoiceQueries();
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
      invalidateInvoiceQueries();
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
