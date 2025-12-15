import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesService, type Vehicle, type NewVehicle, type UpdateVehicle } from '@/services/supabase/vehicles';
import { useToast } from '@/hooks/use-toast';
import { useImpersonation } from '@/hooks/use-impersonation';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDetailedTracking } from '@/hooks/tracking/useDetailedTracking';

export function useClientVehicles(clientId?: string) {
  const {
    data: vehicles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['vehicles', 'client', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const data = await vehiclesService.getByClientId(clientId);
      return data as Vehicle[];
    },
    enabled: !!clientId
  });

  return {
    vehicles,
    isLoading,
    error
  };
}

export function useVehicles() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isImpersonating, impersonationData } = useImpersonation();
  const { trackAction } = useDetailedTracking();

  // Invalider les requêtes lors du changement d'impersonation
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
  }, [isImpersonating, impersonationData?.company_id, queryClient]);

  const {
    data: vehicles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['vehicles', impersonationData?.company_id || 'normal'],
    queryFn: async () => {
      const data = await vehiclesService.getAll();
      return data as Vehicle[];
    },
    staleTime: 10000, // 10 secondes avant refetch
  });

  const createVehicle = useMutation({
    mutationFn: async (vehicleData: NewVehicle) => {
      return await vehiclesService.create(vehicleData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: "Véhicule créé",
        description: "Le véhicule a été créé avec succès."
      });
      
      // Track vehicle creation
      trackAction('vehicle_created', {
        vehicle_id: data?.id,
        license_plate: data?.license_plate,
        vin: data?.vin
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer le véhicule: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateVehicle = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: UpdateVehicle }) => {
      return await vehiclesService.update(id, data);
    },
    onSuccess: (updatedData, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: "Véhicule mis à jour",
        description: "Le véhicule a été mis à jour avec succès."
      });
      
      // Track vehicle update
      trackAction('vehicle_updated', {
        vehicle_id: id,
        license_plate: data?.license_plate || updatedData?.license_plate
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le véhicule: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteVehicle = useMutation({
    mutationFn: async (id: string) => {
      return await vehiclesService.delete(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: "Véhicule supprimé",
        description: "Le véhicule a été supprimé avec succès."
      });
      
      // Track vehicle deletion
      trackAction('vehicle_deleted', {
        vehicle_id: id
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le véhicule: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  return {
    vehicles,
    isLoading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle
  };
}
