import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { VehicleStatus } from '@/types/vehicle';

export type Vehicle = Database['public']['Tables']['vehicles']['Row'];
export type NewVehicle = Database['public']['Tables']['vehicles']['Insert'];
export type UpdateVehicle = Database['public']['Tables']['vehicles']['Update'];

export const vehiclesService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*, clients(first_name, last_name)')
      .order('brand');

    if (error) {
      console.error('Error fetching vehicles:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  getByClientId: async (clientId: string) => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
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
      .select('*, clients(id, first_name, last_name)')
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
    if (!vehicle.client_id || !vehicle.vin || !vehicle.brand || !vehicle.model || !vehicle.license_plate) {
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
      .select()
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
      .select()
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
