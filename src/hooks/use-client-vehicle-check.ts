import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/services/supabase/clients';

export const useClientVehicleCheck = (client: Client) => {
  const [hasVehicle, setHasVehicle] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkVehicle = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('vehicles')
          .select('id')
          .eq('client_id', client.id)
          .limit(1)
          .single();
        
        setHasVehicle(!error && !!data);
      } catch {
        setHasVehicle(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkVehicle();
  }, [client.id]);

  return { hasVehicle, isLoading };
};