
import { useQuery } from '@tanstack/react-query';
import { vehiclesService } from '@/services/supabase/vehicles';

export function useClientVehicles(clientId?: string) {
  const {
    data: vehicles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['vehicles', 'client', clientId],
    queryFn: () => clientId ? vehiclesService.getByClientId(clientId) : Promise.resolve([]),
    enabled: !!clientId
  });
  
  return {
    vehicles: vehicles || [],
    isLoading,
    error
  };
}
