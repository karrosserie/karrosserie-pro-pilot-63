
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients(first_name, last_name),
          vehicles(
            id,
            license_plate,
            car_brands(id, name),
            car_models(id, name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
        throw new Error(error.message);
      }

      return data;
    }
  });

  const createInvoice = useMutation({
    mutationFn: async (invoiceData: any) => {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select(`
          *,
          clients(first_name, last_name),
          vehicles(
            id,
            license_plate,
            car_brands(id, name),
            car_models(id, name)
          )
        `)
        .single();

      if (error) {
        console.error('Error creating invoice:', error);
        throw new Error(error.message);
      }

      return data;
    },
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
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { data: result, error } = await supabase
        .from('invoices')
        .update(data)
        .eq('id', id)
        .select(`
          *,
          clients(first_name, last_name),
          vehicles(
            id,
            license_plate,
            car_brands(id, name),
            car_models(id, name)
          )
        `)
        .single();

      if (error) {
        console.error('Error updating invoice:', error);
        throw new Error(error.message);
      }

      return result;
    },
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
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting invoice:', error);
        throw new Error(error.message);
      }

      return true;
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

  return {
    invoices,
    isLoading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice
  };
}
