
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fleetReservationsService, NewFleetReservation, UpdateFleetReservation } from '@/services/supabase/fleet-reservations';
import { useToast } from '@/hooks/use-toast';

export function useFleetReservations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: reservations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetReservations'],
    queryFn: fleetReservationsService.getAll
  });
  
  const createReservation = useMutation({
    mutationFn: (newReservation: NewFleetReservation) => fleetReservationsService.create(newReservation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetReservations'] });
      toast({
        title: "Réservation créée",
        description: "La réservation a été créée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer la réservation: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateReservation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateFleetReservation }) => 
      fleetReservationsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetReservations'] });
      toast({
        title: "Réservation mise à jour",
        description: "La réservation a été mise à jour avec succès."
      });
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
      toast({
        title: "Réservation supprimée",
        description: "La réservation a été supprimée avec succès."
      });
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
    queryFn: () => id ? fleetReservationsService.getById(id) : null,
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
    queryFn: () => vehicleId ? fleetReservationsService.getByVehicleId(vehicleId) : [],
    enabled: !!vehicleId
  });
  
  return {
    reservations,
    isLoading,
    error
  };
}
