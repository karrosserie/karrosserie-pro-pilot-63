import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fleetViolationsService, NewFleetViolation, UpdateFleetViolation } from '@/services/supabase/fleet-violations';
import { useToast } from '@/hooks/use-toast';

export function useFleetViolations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: violations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetViolations'],
    queryFn: fleetViolationsService.getAll
  });
  
  const createViolation = useMutation({
    mutationFn: (newViolation: NewFleetViolation) => fleetViolationsService.create(newViolation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetViolations'] });
      toast({
        title: "Contravention ajoutée",
        description: "La contravention a été ajoutée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter la contravention: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateViolation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateFleetViolation }) => 
      fleetViolationsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetViolations'] });
      toast({
        title: "Contravention mise à jour",
        description: "La contravention a été mise à jour avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour la contravention: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteViolation = useMutation({
    mutationFn: (id: string) => fleetViolationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetViolations'] });
      toast({
        title: "Contravention supprimée",
        description: "La contravention a été supprimée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la contravention: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  return {
    violations,
    isLoading,
    error,
    createViolation,
    updateViolation,
    deleteViolation
  };
}

export function useFleetViolation(id?: string) {
  const {
    data: violation,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetViolations', id],
    queryFn: () => id ? fleetViolationsService.getById(id) : null,
    enabled: !!id
  });
  
  return {
    violation,
    isLoading,
    error
  };
}

export function useVehicleViolations(vehicleId?: string) {
  const {
    data: violations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetViolations', 'vehicle', vehicleId],
    queryFn: () => vehicleId ? fleetViolationsService.getByVehicleId(vehicleId) : [],
    enabled: !!vehicleId
  });
  
  return {
    violations,
    isLoading,
    error
  };
}