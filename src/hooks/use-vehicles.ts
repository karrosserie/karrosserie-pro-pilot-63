
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useClientVehicles(clientId?: string) {
  const {
    data: vehicles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['vehicles', 'client', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('client_id', clientId);

      if (error) {
        console.error('Error fetching client vehicles:', error);
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!clientId
  });

  return {
    vehicles,
    isLoading,
    error
  };
}
