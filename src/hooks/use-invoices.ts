
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { invoicesService } from '@/services/supabase/invoices';
import { useImpersonation } from '@/hooks/use-impersonation';
import { useEffect } from 'react';
import { userActionWebhookService } from '@/services/tracking/UserActionWebhookService';

export function useInvoices(showArchived: boolean = false) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isImpersonating, impersonationData } = useImpersonation();

  // Invalider les requêtes lors du changement d'impersonation
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['invoices'] });
  }, [isImpersonating, impersonationData?.company_id, queryClient]);

  const {
    data: invoices,
    isLoading,
    error
  } = useQuery({
    queryKey: ['invoices', impersonationData?.company_id || 'normal', showArchived],
    queryFn: async () => {
      return await invoicesService.getAll(showArchived);
    }
  });

  const createInvoice = useMutation({
    mutationFn: async (invoiceData: any) => {
      return await invoicesService.create(invoiceData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Facture créée",
        description: "La facture a été créée avec succès."
      });
      
      // Envoyer le webhook
      userActionWebhookService.sendUserAction('creation_facture', {
        invoice_id: data?.id,
        invoice_reference: data?.reference
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
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      toast({
        title: "Facture mise à jour",
        description: "La facture a été mise à jour avec succès."
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Facture supprimée",
        description: "La facture a été supprimée avec succès."
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
