
import { supabase } from '@/integrations/supabase/client';

// Updated type definitions to match the new schema
export interface Vehicle {
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
  arrival_date: string | null;
  end_date: string | null;
  engine_number: string | null;
  fuel_level: number | null;
  insurance_company: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export interface VehicleWithRelations extends Vehicle {
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

export type NewVehicle = Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>;
export type UpdateVehicle = Partial<Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>>;

export const vehiclesService = {
  getAll: async (): Promise<VehicleWithRelations[]> => {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        clients(first_name, last_name),
        car_brands!vehicles_brand_id_fkey(id, name),
        car_models!vehicles_model_id_fkey(id, name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching vehicles:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },
  
  getByClientId: async (clientId: string): Promise<VehicleWithRelations[]> => {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        car_brands!vehicles_brand_id_fkey(id, name),
        car_models!vehicles_model_id_fkey(id, name)
      `)
      .eq('client_id', clientId);
      
    if (error) {
      console.error(`Error fetching vehicles for client ${clientId}:`, error);
      throw new Error(error.message);
    }
    
    return data || [];
  },

  getById: async (id: string): Promise<VehicleWithRelations> => {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        clients(id, first_name, last_name),
        car_brands!vehicles_brand_id_fkey(id, name),
        car_models!vehicles_model_id_fkey(id, name)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching vehicle with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  create: async (vehicle: NewVehicle): Promise<VehicleWithRelations> => {
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
        car_brands!vehicles_brand_id_fkey(id, name),
        car_models!vehicles_model_id_fkey(id, name)
      `)
      .single();
      
    if (error) {
      console.error('Error creating vehicle:', error);
      throw new Error(error.message);
    }
    
    console.log('Vehicle created successfully:', data);
    return data;
  },
  
  update: async (id: string, vehicle: UpdateVehicle): Promise<VehicleWithRelations> => {
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
        car_brands!vehicles_brand_id_fkey(id, name),
        car_models!vehicles_model_id_fkey(id, name)
      `)
      .single();
      
    if (error) {
      console.error(`Error updating vehicle with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    console.log('Vehicle updated successfully:', data);
    return data;
  },
  
  delete: async (id: string): Promise<boolean> => {
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
