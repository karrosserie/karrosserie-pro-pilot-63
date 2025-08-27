import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { demoService, DEMO_MODE } from '@/services/demoService';
import { useToast } from '@/hooks/use-toast';
import { useCompanyId } from '@/hooks/use-company-id';

export function useQuotes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { companyId } = useCompanyId();

  const {
    data: quotes,
    isLoading,
    error
  } = useQuery({
    queryKey: ['quotes', companyId],
    queryFn: async () => {
      if (DEMO_MODE) {
        const { data } = await demoService.quotes.getAll();
        return data || [];
      }
      
      if (!companyId) return [];
      
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
          ),
          repair_orders!quote_id(id, reference)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
        throw new Error(error.message);
      }

      return data;
    },
    enabled: DEMO_MODE || !!companyId
  });

  const createQuote = useMutation({
    mutationFn: async (quoteData: any) => {
      if (DEMO_MODE) {
        const { data } = await demoService.quotes.create(quoteData);
        return data;
      }

      if (!companyId) {
        throw new Error('Company ID is required');
      }

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
      if (DEMO_MODE) {
        const { data: result, error } = await demoService.quotes.update(id, data);
        if (error) {
          throw new Error(error);
        }
        return result;
      }
      
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
      if (DEMO_MODE) {
        const { error } = await demoService.quotes.delete(id);
        if (error) {
          throw new Error(error);
        }
        return true;
      }
      
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
