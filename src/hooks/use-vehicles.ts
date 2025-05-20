
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesService, NewVehicle, UpdateVehicle } from '@/services/supabase/vehicles';
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
    mutationFn: (newVehicle: NewVehicle) => vehiclesService.create(newVehicle),
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
    mutationFn: ({ id, data }: { id: string, data: UpdateVehicle }) => 
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
    mutationFn: (id: string) => vehiclesService.delete(id),
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
    vehicles,
    isLoading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle
  };
}

export function useVehicle(id?: string) {
  const {
    data: vehicle,
    isLoading,
    error
  } = useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => id ? vehiclesService.getById(id) : null,
    enabled: !!id
  });
  
  return {
    vehicle,
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
    queryFn: () => clientId ? vehiclesService.getByClientId(clientId) : [],
    enabled: !!clientId
  });
  
  return {
    vehicles,
    isLoading,
    error
  };
}
