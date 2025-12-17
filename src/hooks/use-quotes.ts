import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUserCompanyId } from '@/services/supabase/auth-company';
import { useImpersonation } from '@/hooks/use-impersonation';
import { useEffect, useState } from 'react';
import { useDetailedTracking } from '@/hooks/tracking/useDetailedTracking';
import { useQuoteToReservationLinker } from './use-quote-to-reservation-linker';

export function useQuotes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isImpersonating, impersonationData } = useImpersonation();
  const { trackAction } = useDetailedTracking();
  const [createdQuote, setCreatedQuote] = useState<{ id: string; client_id: string; reference: string } | null>(null);

  // Invalider les requêtes lors du changement d'impersonation
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['quotes'] });
    queryClient.invalidateQueries({ queryKey: ['invoices'] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImpersonating, impersonationData?.company_id]);

  // Use quote-to-reservation linker
  useQuoteToReservationLinker({
    createdQuote,
    onLinkComplete: () => {
      queryClient.invalidateQueries({ queryKey: ['fleet-reservations'] });
      setCreatedQuote(null);
    }
  });

  const {
    data: quotes,
    isLoading,
    error
  } = useQuery({
    queryKey: ['quotes', impersonationData?.company_id || 'normal'],
    queryFn: async () => {
      const { quotesService } = await import('@/services/supabase/quotes');
      return await quotesService.getAll();
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: "Devis créé",
        description: "Le devis a été créé avec succès."
      });
      
      // Track quote creation
      trackAction('quote_created', {
        quote_id: data?.id,
        quote_reference: data?.reference,
        client_id: data?.client_id,
        vehicle_id: data?.vehicle_id,
        amount: data?.amount
      });

      // Set created quote for reservation linker
      if (data?.id && data?.client_id && data?.reference) {
        setCreatedQuote({
          id: data.id,
          client_id: data.client_id,
          reference: data.reference
        });
      }
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
          clients(first_name, last_name, email, phone),
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
    onSuccess: async (updatedQuote) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      // Track quote update
      trackAction('quote_updated', {
        quote_id: updatedQuote?.id,
        quote_reference: updatedQuote?.reference
      });
      
      // Envoyer les données au webhook N8n
      try {
        const webhookUrl = 'https://n8n.karrosserie.pro/webhook/0c2053ca-0621-42c7-81df-b890fb2b494f';
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...updatedQuote,
            company_id: updatedQuote.company_id,
            notes: updatedQuote.notes,
            client_email: updatedQuote.clients?.email || '',
            client_phone: updatedQuote.clients?.phone || '',
            timestamp: new Date().toISOString()
          })
        });

        if (response.ok) {
          toast({
            title: "Devis mis à jour et envoyé",
            description: "Le devis a été mis à jour et envoyé au workflow avec succès."
          });
        } else {
          throw new Error('Erreur lors de l\'envoi au workflow');
        }
      } catch (error) {
        console.error('Error sending to N8n webhook:', error);
        toast({
          title: "Devis mis à jour",
          description: "Le devis a été mis à jour mais l'envoi au workflow a échoué.",
          variant: "destructive"
        });
      }
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

  const restoreQuote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('quotes')
        .update({ archived: false })
        .eq('id', id);

      if (error) {
        console.error('Error restoring quote:', error);
        throw new Error(error.message);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
    onError: (error) => {
      console.error('Restore quote error:', error);
    }
  });

  return {
    quotes,
    isLoading,
    error,
    createQuote,
    updateQuote,
    deleteQuote,
    archiveQuote,
    restoreQuote
  };
}
