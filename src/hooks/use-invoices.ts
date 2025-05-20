
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesService, NewInvoice, UpdateInvoice } from '@/services/supabase/invoices';
import { useToast } from '@/hooks/use-toast';

export function useInvoices() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: invoices,
    isLoading,
    error
  } = useQuery({
    queryKey: ['invoices'],
    queryFn: invoicesService.getAll
  });
  
  const createInvoice = useMutation({
    mutationFn: (newInvoice: NewInvoice) => invoicesService.create(newInvoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Facture créée",
        description: "La facture a été créée avec succès."
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
    mutationFn: ({ id, data }: { id: string, data: UpdateInvoice }) => 
      invoicesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
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
    mutationFn: (id: string) => invoicesService.delete(id),
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
  
  return {
    invoices,
    isLoading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice
  };
}

export function useInvoice(id?: string) {
  const {
    data: invoice,
    isLoading,
    error
  } = useQuery({
    queryKey: ['invoices', id],
    queryFn: () => id ? invoicesService.getById(id) : null,
    enabled: !!id
  });
  
  return {
    invoice,
    isLoading,
    error
  };
}
