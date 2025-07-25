import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUserCompanyId } from '@/services/supabase/auth-company';

export function useQuotes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: quotes,
    isLoading,
    error
  } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          clients(id, first_name, last_name),
          vehicles(
            id,
            license_plate,
            car_brands(id, name),
            car_models(id, name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
        throw new Error(error.message);
      }

      return data;
    }
  });

  const createQuote = useMutation({
    mutationFn: async (quoteData: any) => {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting current user:', userError);
        throw new Error('User not authenticated');
      }

      const companyId = await getCurrentUserCompanyId();

      // Add company_id automatically
      const quoteWithCompanyId = {
        ...quoteData,
        company_id: companyId
      };

      const { data, error } = await supabase
        .from('quotes')
        .insert([quoteWithCompanyId])
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
        console.error('Error creating quote:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: "Devis créé",
        description: "Le devis a été créé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer le devis: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateQuote = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { data: result, error } = await supabase
        .from('quotes')
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
        console.error('Error updating quote:', error);
        throw new Error(error.message);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: "Devis mis à jour",
        description: "Le devis a été mis à jour avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le devis: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteQuote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting quote:', error);
        throw new Error(error.message);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: "Devis supprimé",
        description: "Le devis a été supprimé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le devis: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  return {
    quotes,
    isLoading,
    error,
    createQuote,
    updateQuote,
    deleteQuote
  };
}
