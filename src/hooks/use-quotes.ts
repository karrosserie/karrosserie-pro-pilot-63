import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUserCompanyId } from '@/services/supabase/auth-company';
import { useImpersonation } from '@/hooks/use-impersonation';
import { useEffect } from 'react';

export function useQuotes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isImpersonating, impersonationData } = useImpersonation();

  // Invalider les requêtes lors du changement d'impersonation
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['quotes'] });
  }, [isImpersonating, impersonationData?.company_id, queryClient]);

  const {
    data: quotes,
    isLoading,
    error
  } = useQuery({
    queryKey: ['quotes', impersonationData?.company_id || 'normal'],
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
          ),
          repair_orders!quote_id(id, reference)
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
      console.log('🚀 useQuotes - createQuote called with:', JSON.stringify(quoteData, null, 2));
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting current user:', userError);
        throw new Error('User not authenticated');
      }

      const companyId = await getCurrentUserCompanyId();
      console.log('🏢 useQuotes - Company ID:', companyId);

      // Add company_id automatically
      const quoteWithCompanyId = {
        ...quoteData,
        company_id: companyId
      };

      console.log('📝 useQuotes - About to insert quote:', JSON.stringify(quoteWithCompanyId, null, 2));
      console.log('📋 useQuotes - Checking required fields:');
      console.log('  - client_id:', quoteWithCompanyId.client_id, typeof quoteWithCompanyId.client_id);
      console.log('  - vehicle_id:', quoteWithCompanyId.vehicle_id, typeof quoteWithCompanyId.vehicle_id);
      console.log('  - company_id:', quoteWithCompanyId.company_id, typeof quoteWithCompanyId.company_id);

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
        console.error('❌ useQuotes - Database error creating quote:', error);
        console.error('❌ useQuotes - Error details:', error.details);
        console.error('❌ useQuotes - Error hint:', error.hint);
        console.error('❌ useQuotes - Error message:', error.message);
        throw new Error(error.message);
      }

      console.log('✅ useQuotes - Quote created successfully:', data);
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

  const archiveQuote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('quotes')
        .update({ archived: true })
        .eq('id', id);

      if (error) {
        console.error('Error archiving quote:', error);
        throw new Error(error.message);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
    onError: (error) => {
      console.error('Archive quote error:', error);
    }
  });

  return {
    quotes,
    isLoading,
    error,
    createQuote,
    updateQuote,
    deleteQuote,
    archiveQuote
  };
}
