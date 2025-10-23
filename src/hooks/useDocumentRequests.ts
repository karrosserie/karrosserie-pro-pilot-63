import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DocumentRequestAlert {
  id: number;
  client_id: string;
  company_id: string;
  probleme: string;
  created_at: string;
}

export function useDocumentRequests(companyId?: string | null) {
  return useQuery({
    queryKey: ['document-requests', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('remonté_demande_document' as any)
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des demandes de documents:', error);
        throw error;
      }

      return (data || []) as unknown as DocumentRequestAlert[];
    },
    enabled: !!companyId,
  });
}
