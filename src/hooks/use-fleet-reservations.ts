import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fleetReservationsService, NewFleetReservation, UpdateFleetReservation } from '@/services/supabase/fleet-reservations';
import { useToast } from '@/hooks/use-toast';
import { STATIC_FLEET_RESERVATIONS, mockApiDelay } from '@/data/staticData';

export function useFleetReservations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: reservations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetReservations'],
    queryFn: async () => {
      await mockApiDelay(700);
      return STATIC_FLEET_RESERVATIONS;
    }
  });
  
  const createReservation = useMutation({
    mutationFn: (newReservation: NewFleetReservation) => fleetReservationsService.create(newReservation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetReservations'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer le prêt: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateReservation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateFleetReservation }) => 
      fleetReservationsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetReservations'] });
      // Pas de toast pour la mise à jour
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour la réservation: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteReservation = useMutation({
    mutationFn: (id: string) => fleetReservationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetReservations'] });
      // Pas de toast pour la suppression
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la réservation: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  return {
    reservations,
    isLoading,
    error,
    createReservation,
    updateReservation,
    deleteReservation
  };
}

export function useFleetReservation(id?: string) {
  const {
    data: reservation,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetReservations', id],
    queryFn: async () => {
      if (!id) return null;
      await mockApiDelay(400);
      return STATIC_FLEET_RESERVATIONS.find(r => r.id === id) || null;
    },
    enabled: !!id
  });
  
  return {
    reservation,
    isLoading,
    error
  };
}

export function useVehicleReservations(vehicleId?: string) {
  const {
    data: reservations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetReservations', 'vehicle', vehicleId],
    queryFn: async () => {
      if (!vehicleId) return [];
      await mockApiDelay(300);
      return STATIC_FLEET_RESERVATIONS.filter(r => r.fleet_vehicle_id === vehicleId);
    },
    enabled: !!vehicleId
  });
  
  return {
    reservations,
    isLoading,
    error
  };
}
