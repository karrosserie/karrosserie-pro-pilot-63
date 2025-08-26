import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { useToast } from '@/hooks/use-toast';

export interface InvoiceRelance {
  id: string;
  client_id: string;
  invoice_id: string;
  channel: string;
  tone: string;
  status: string;
  subject?: string;
  message?: string;
  client_response?: string;
  response_read: boolean;
  sent_at?: string;
  created_at: string;
  clients?: {
    first_name: string;
    last_name: string;
    phone?: string;
    email?: string;
  } | null;
}

export const useInvoiceRelances = (invoiceId?: string) => {
  const { companyData } = useCompany();
  const [relances, setRelances] = useState<InvoiceRelance[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchInvoiceRelances = async () => {
    if (!companyData?.id || !invoiceId) return;

    // Vérifier si invoiceId est un UUID valide
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(invoiceId)) {
      console.error('Invalid UUID format for invoiceId:', invoiceId);
      toast({
        title: "Erreur",
        description: "ID de facture invalide",
        variant: "destructive",
      });
      return;
    }

    console.log('Fetching relances for invoiceId:', invoiceId);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_relances')
        .select(`
          *,
          clients (
            first_name,
            last_name,
            phone,
            email
          )
        `)
        .eq('company_id', companyData.id)
        .eq('invoice_id', invoiceId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoice relances:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des relances",
          variant: "destructive",
        });
        return;
      }

      setRelances((data as any) || []);
    } catch (error) {
      console.error('Error in fetchInvoiceRelances:', error);
    } finally {
      setLoading(false);
    }
  };

  const markResponseAsRead = async (relanceId: string) => {
    try {
      const { error } = await supabase
        .from('client_relances')
        .update({ response_read: true })
        .eq('id', relanceId);

      if (error) {
        console.error('Error marking response as read:', error);
        toast({
          title: "Erreur",
          description: "Impossible de marquer la réponse comme lue",
          variant: "destructive",
        });
        return false;
      }

      // Mettre à jour localement
      setRelances(prev => prev.map(relance => 
        relance.id === relanceId 
          ? { ...relance, response_read: true }
          : relance
      ));

      return true;
    } catch (error) {
      console.error('Error in markResponseAsRead:', error);
      return false;
    }
  };

  const hasUnreadResponses = () => {
    return relances.some(relance => 
      relance.client_response && 
      !relance.response_read
    );
  };

  const getUnreadResponsesCount = () => {
    return relances.filter(relance => 
      relance.client_response && 
      !relance.response_read
    ).length;
  };

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceRelances();
    }
  }, [companyData?.id, invoiceId]);

  return {
    relances,
    loading,
    hasUnreadResponses,
    getUnreadResponsesCount,
    markResponseAsRead,
    refetch: fetchInvoiceRelances,
  };
};