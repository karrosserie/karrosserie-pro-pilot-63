
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { VehicleStatus } from '@/types/vehicle';

export type Vehicle = Database['public']['Tables']['vehicles']['Row'] & {
  car_brands?: {
    id: string;
    name: string;
  };
  car_models?: {
    id: string;
    name: string;
  };
  clients?: {
    first_name: string;
    last_name: string;
  };
};

export type NewVehicle = Database['public']['Tables']['vehicles']['Insert'];
export type UpdateVehicle = Database['public']['Tables']['vehicles']['Update'];

export const vehiclesService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        car_brands(id, name),
        car_models(id, name),
        clients(first_name, last_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching vehicles:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  getByClientId: async (clientId: string) => {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        car_brands(id, name),
        car_models(id, name)
      `)
      .eq('client_id', clientId);
      
    if (error) {
      console.error(`Error fetching vehicles for client ${clientId}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        car_brands(id, name),
        car_models(id, name),
        clients(id, first_name, last_name)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching vehicle with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  create: async (vehicle: NewVehicle) => {
    // Validate required fields
    if (!vehicle.client_id || !vehicle.vin || !vehicle.brand_id || !vehicle.model_id || !vehicle.license_plate) {
      throw new Error('Les champs Client, Numéro de série (VIN), Marque, Modèle et Plaque d\'immatriculation sont obligatoires.');
    }

    // Ensure status is valid
    if (vehicle.status && !['En attente', 'Réservé', 'En cours', 'Terminé', 'Annulé'].includes(vehicle.status)) {
      vehicle.status = 'En attente';
    }

    console.log('Creating vehicle with data:', vehicle);

    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicle])
      .select(`
        *,
        car_brands(id, name),
        car_models(id, name)
      `)
      .single();
      
    if (error) {
      console.error('Error creating vehicle:', error);
      throw new Error(error.message);
    }
    
    console.log('Vehicle created successfully:', data);
    return data;
  },
  
  update: async (id: string, vehicle: UpdateVehicle) => {
    // Ensure status is valid
    if (vehicle.status && !['En attente', 'Réservé', 'En cours', 'Terminé', 'Annulé'].includes(vehicle.status)) {
      vehicle.status = 'En attente';
    }

    console.log('Updating vehicle with id:', id, 'and data:', vehicle);

    const { data, error } = await supabase
      .from('vehicles')
      .update(vehicle)
      .eq('id', id)
      .select(`
        *,
        car_brands(id, name),
        car_models(id, name)
      `)
      .single();
      
    if (error) {
      console.error(`Error updating vehicle with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    console.log('Vehicle updated successfully:', data);
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting vehicle with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};
