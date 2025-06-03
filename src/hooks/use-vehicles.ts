
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesService } from '@/services/supabase/vehicles';
import { useToast } from '@/hooks/use-toast';

export function useVehicles() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: vehicles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesService.getAll
  });

  const createVehicle = useMutation({
    mutationFn: vehiclesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: "Véhicule créé",
        description: "Le véhicule a été créé avec succès."
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
    mutationFn: ({ id, data }: { id: string, data: any }) => 
      vehiclesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: "Véhicule mis à jour",
        description: "Le véhicule a été mis à jour avec succès."
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
    mutationFn: vehiclesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: "Véhicule supprimé",
        description: "Le véhicule a été supprimé avec succès."
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
    vehicles: vehicles || [],
    isLoading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle
  };
}

export function useClientVehicles(clientId?: string, vehicleId?: string) {
  const {
    data: vehicles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['vehicles', 'client', clientId, vehicleId],
    queryFn: async () => {
      // Si on a un client, charger ses véhicules
      if (clientId) {
        return vehiclesService.getByClientId(clientId);
      }
      // Si on a seulement un vehicle_id (cas d'édition sans client), 
      // on doit d'abord récupérer le véhicule pour connaître son client
      if (vehicleId && !clientId) {
        const allVehicles = await vehiclesService.getAll();
        const vehicle = allVehicles.find(v => v.id === vehicleId);
        if (vehicle) {
          // Retourner tous les véhicules du client pour permettre le changement
          return vehiclesService.getByClientId(vehicle.client_id);
        }
        return [];
      }
      return [];
    },
    enabled: !!(clientId || vehicleId)
  });
  
  return {
    vehicles: vehicles || [],
    isLoading,
    error
  };
}
