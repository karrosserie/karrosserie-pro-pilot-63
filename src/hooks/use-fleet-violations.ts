import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fleetViolationsService, NewFleetViolation, UpdateFleetViolation } from '@/services/supabase/fleet-violations';
import { useToast } from '@/hooks/use-toast';
import { STATIC_FLEET_VIOLATIONS, mockApiDelay } from '@/data/staticData';

export function useFleetViolations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: violations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetViolations'],
    queryFn: async () => {
      await mockApiDelay(500);
      return STATIC_FLEET_VIOLATIONS;
    }
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
    queryFn: async () => {
      if (!id) return null;
      await mockApiDelay(300);
      return STATIC_FLEET_VIOLATIONS.find(v => v.id === id) || null;
    },
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
    queryFn: async () => {
      if (!vehicleId) return [];
      await mockApiDelay(250);
      return STATIC_FLEET_VIOLATIONS.filter(v => v.fleet_vehicle_id === vehicleId);
    },
    enabled: !!vehicleId
  });
  
  return {
    violations,
    isLoading,
    error
  };
}