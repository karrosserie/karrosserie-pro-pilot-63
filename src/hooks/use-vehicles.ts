
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesService, NewVehicle, UpdateVehicle } from '@/services/supabase/vehicles';
import { useToast } from '@/hooks/use-toast';

// Type pour véhicule avec relations
interface Vehicle {
  id: string;
  client_id: string | null;
  brand_id: string;
  model_id: string;
  year: number | null;
  license_plate: string | null;
  color: string | null;
  vin: string | null;
  mileage: number | null;
  fuel_type: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  clients?: {
    first_name: string;
    last_name: string;
  };
  car_brands?: {
    id: string;
    name: string;
  };
  car_models?: {
    id: string;
    name: string;
  };
}

export function useClientVehicles(clientId?: string) {
  const {
    data: vehicles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['vehicles', 'client', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      return vehiclesService.getByClientId(clientId);
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

  const {
    data: vehicles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesService.getAll
  });

  const createVehicle = useMutation({
    mutationFn: async (vehicleData: any) => {
      // Convertir les données du formulaire vers le format attendu
      const newVehicle: NewVehicle = {
        client_id: vehicleData.clientId || vehicleData.client_id,
        brand_id: vehicleData.brandId || vehicleData.brand_id,
        model_id: vehicleData.modelId || vehicleData.model_id,
        year: vehicleData.year ? parseInt(vehicleData.year) : null,
        license_plate: vehicleData.licensePlate || vehicleData.license_plate,
        color: vehicleData.color,
        vin: vehicleData.vin,
        mileage: vehicleData.mileage ? parseInt(vehicleData.mileage) : null,
        fuel_type: vehicleData.fuelType || vehicleData.fuel_type,
        status: vehicleData.status || 'En attente',
        user_id: vehicleData.user_id
      };

      return vehiclesService.create(newVehicle);
    },
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
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      // Convertir les données du formulaire vers le format attendu
      const updateData: UpdateVehicle = {
        client_id: data.clientId || data.client_id,
        brand_id: data.brandId || data.brand_id,
        model_id: data.modelId || data.model_id,
        year: data.year ? parseInt(data.year) : null,
        license_plate: data.licensePlate || data.license_plate,
        color: data.color,
        vin: data.vin,
        mileage: data.mileage ? parseInt(data.mileage) : null,
        fuel_type: data.fuelType || data.fuel_type,
        status: data.status
      };

      return vehiclesService.update(id, updateData);
    },
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
    vehicles,
    isLoading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle
  };
}
