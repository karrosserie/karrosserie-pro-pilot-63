
import { useQuery } from '@tanstack/react-query';
import { vehiclesService } from '@/services/supabase/vehicles';

export function useVehicles() {
  const {
    data: vehicles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesService.getAll
  });
  
  return {
    vehicles: vehicles || [],
    isLoading,
    error
  };
}

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
