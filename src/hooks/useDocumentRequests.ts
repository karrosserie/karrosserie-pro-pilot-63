import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DocumentRequestAlert {
  id: number;
  client_id: string;
  company_id: string;
  probleme: string;
  created_at: string;
  client?: {
    first_name: string;
    last_name: string;
  };
}

export function useDocumentRequests(companyId?: string | null) {
  return useQuery({
    queryKey: ['document-requests', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('remonté_demande_document' as any)
        .select(`
          *,
          clients!client_id(first_name, last_name)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des demandes de documents:', error);
        throw error;
      }

      console.log('Document requests data:', data);

      return (data || []).map((item: any) => ({
        id: item.id,
        client_id: item.client_id,
        company_id: item.company_id,
        probleme: item.probleme,
        created_at: item.created_at,
        client: item.clients || null
      })) as DocumentRequestAlert[];
    },
    enabled: !!companyId,
  });
}
