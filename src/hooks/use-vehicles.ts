

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

// Use the actual Supabase type for vehicles
type VehicleRow = Database['public']['Tables']['vehicles']['Row'];

interface Vehicle extends VehicleRow {
  car_brands?: {
    id: string;
    name: string;
  } | null;
  car_models?: {
    id: string;
    name: string;
  } | null;
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  insurance_companies?: {
    id: string;
    name: string;
  } | null;
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
      
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          car_brands(id, name),
          car_models(id, name),
          insurance_companies(id, name)
        `)
        .eq('client_id', clientId);

      if (error) {
        console.error('Error fetching client vehicles:', error);
        throw new Error(error.message);
      }

      return data as Vehicle[];
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
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          car_brands(id, name),
          car_models(id, name),
          clients(
            id,
            first_name,
            last_name
          ),
          insurance_companies(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vehicles:', error);
        throw new Error(error.message);
      }

      return data as Vehicle[];
    }
  });

  const createVehicle = useMutation({
    mutationFn: async (vehicleData: any) => {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicleData])
        .select(`
          *,
          car_brands(id, name),
          car_models(id, name),
          insurance_companies(id, name)
        `)
        .single();

      if (error) {
        console.error('Error creating vehicle:', error);
        throw new Error(error.message);
      }

      return data;
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
      const { data: result, error } = await supabase
        .from('vehicles')
        .update(data)
        .eq('id', id)
        .select(`
          *,
          car_brands(id, name),
          car_models(id, name),
          insurance_companies(id, name)
        `)
        .single();

      if (error) {
        console.error('Error updating vehicle:', error);
        throw new Error(error.message);
      }

      return result;
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
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting vehicle:', error);
        throw new Error(error.message);
      }

      return true;
    },
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
