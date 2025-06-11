
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fleetReturnsService, NewFleetReturn, UpdateFleetReturn } from '@/services/supabase/fleet-returns';
import { useToast } from '@/hooks/use-toast';

export function useFleetReturns() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: returns,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetReturns'],
    queryFn: fleetReturnsService.getAll
  });
  
  const createReturn = useMutation({
    mutationFn: (newReturn: NewFleetReturn) => fleetReturnsService.create(newReturn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetReturns'] });
      queryClient.invalidateQueries({ queryKey: ['fleetReservations'] });
      toast({
        title: "Retour enregistré",
        description: "Le retour du véhicule a été enregistré avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible d'enregistrer le retour: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateReturn = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateFleetReturn }) => 
      fleetReturnsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetReturns'] });
      toast({
        title: "Retour mis à jour",
        description: "Le retour a été mis à jour avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le retour: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteReturn = useMutation({
    mutationFn: (id: string) => fleetReturnsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetReturns'] });
      toast({
        title: "Retour supprimé",
        description: "Le retour a été supprimé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le retour: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  return {
    returns,
    isLoading,
    error,
    createReturn,
    updateReturn,
    deleteReturn
  };
}

export function useFleetReturn(id?: string) {
  const {
    data: fleetReturn,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetReturns', id],
    queryFn: () => id ? fleetReturnsService.getById(id) : null,
    enabled: !!id
  });
  
  return {
    fleetReturn,
    isLoading,
    error
  };
}

export function useFleetReturnByReservation(reservationId?: string) {
  const {
    data: fleetReturn,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetReturns', 'reservation', reservationId],
    queryFn: () => reservationId ? fleetReturnsService.getByReservationId(reservationId) : null,
    enabled: !!reservationId
  });
  
  return {
    fleetReturn,
    isLoading,
    error
  };
}
