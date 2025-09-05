
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fleetVehiclesService, NewFleetVehicle, UpdateFleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useToast } from '@/hooks/use-toast';
import { STATIC_FLEET_VEHICLES, mockApiDelay } from '@/data/staticData';

export function useFleetVehicles() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: vehicles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetVehicles'],
    queryFn: async () => {
      await mockApiDelay(600);
      return STATIC_FLEET_VEHICLES;
    }
  });
  
  const createVehicle = useMutation({
    mutationFn: (newVehicle: NewFleetVehicle) => fleetVehiclesService.create(newVehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetVehicles'] });
      toast({
        title: "Véhicule de courtoisie créé",
        description: "Le véhicule de courtoisie a été créé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer le véhicule de courtoisie: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateVehicle = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateFleetVehicle }) => 
      fleetVehiclesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetVehicles'] });
      toast({
        title: "Véhicule de courtoisie mis à jour",
        description: "Le véhicule de courtoisie a été mis à jour avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le véhicule de courtoisie: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteVehicle = useMutation({
    mutationFn: (id: string) => fleetVehiclesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetVehicles'] });
      toast({
        title: "Véhicule de courtoisie supprimé",
        description: "Le véhicule de courtoisie a été supprimé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le véhicule de courtoisie: ${error.message}`,
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

export function useFleetVehicle(id?: string) {
  const {
    data: vehicle,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetVehicles', id],
    queryFn: async () => {
      if (!id) return null;
      await mockApiDelay(400);
      return STATIC_FLEET_VEHICLES.find(v => v.id === id) || null;
    },
    enabled: !!id
  });
  
  return {
    vehicle,
    isLoading,
    error
  };
}
