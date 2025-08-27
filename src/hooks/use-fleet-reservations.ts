import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fleetReservationsService, NewFleetReservation, UpdateFleetReservation } from '@/services/supabase/fleet-reservations';
import { useToast } from '@/hooks/use-toast';
import { useCompanyId } from '@/hooks/use-company-id';

export function useFleetReservations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { companyId } = useCompanyId();
  
  const {
    data: reservations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetReservations', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      return fleetReservationsService.getAll(companyId);
    },
    enabled: !!companyId
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
