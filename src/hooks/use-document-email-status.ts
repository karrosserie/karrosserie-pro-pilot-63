import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from './use-company';

interface EmailStatusResult {
  sentInvoices: Set<string>;
  sentQuotes: Set<string>;
  sentRepairOrders: Set<string>;
  isLoading: boolean;
}

export function useDocumentEmailStatus(): EmailStatusResult {
  const { companyData } = useCompany();

  const { data, isLoading } = useQuery({
    queryKey: ['document-email-status', companyData?.id],
    queryFn: async () => {
      if (!companyData?.id) return { invoices: [], quotes: [], repairOrders: [] };

      const { data: messages, error } = await supabase
        .from('messageries')
        .select('title, tags')
        .eq('company_id', companyData.id)
        .contains('tags', ['email']);

      if (error) {
        console.error('Erreur lors de la récupération des emails envoyés:', error);
        return { invoices: [], quotes: [], repairOrders: [] };
      }

      const invoices: string[] = [];
      const quotes: string[] = [];
      const repairOrders: string[] = [];

      for (const msg of messages || []) {
        const title = msg.title || '';
        const tags = msg.tags || [];

        // Extraire la référence du titre (format: "Envoi de [type] [REF]")
        const refMatch = title.match(/(?:Facture|Devis|Ordre de réparation)\s+([A-Z0-9-]+)/i);
        if (!refMatch) continue;

        const reference = refMatch[1];

        if (tags.includes('invoice') || title.toLowerCase().includes('facture')) {
          invoices.push(reference);
        } else if (tags.includes('quote') || title.toLowerCase().includes('devis')) {
          quotes.push(reference);
        } else if (tags.includes('repair_order') || title.toLowerCase().includes('ordre')) {
          repairOrders.push(reference);
        }
      }

      return { invoices, quotes, repairOrders };
    },
    enabled: !!companyData?.id,
    staleTime: 30000, // Cache 30 secondes
  });

  return {
    sentInvoices: new Set(data?.invoices || []),
    sentQuotes: new Set(data?.quotes || []),
    sentRepairOrders: new Set(data?.repairOrders || []),
    isLoading,
  };
}
