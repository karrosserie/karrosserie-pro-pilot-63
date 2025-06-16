
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type FleetVehicle = {
  id: string;
  brand_id: string;
  model_id: string;
  license_plate: string;
  color?: string;
  year?: number;
  vin?: string;
  engine_number?: string;
  mileage?: number;
  status: string;
  insurance_card_url?: string;
  registration_front_url?: string;
  registration_back_url?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  car_brands?: {
    id: string;
    name: string;
  } | null;
  car_models?: {
    id: string;
    name: string;
  } | null;
};

export type NewFleetVehicle = {
  brand_id: string;
  model_id: string;
  license_plate: string;
  user_id: string;
  vin?: string;
  engine_number?: string;
  color?: string;
  year?: number;
  mileage?: number;
  status?: string;
  registration_front_url?: string;
  registration_back_url?: string;
  insurance_card_url?: string;
};

export type UpdateFleetVehicle = {
  brand_id?: string;
  model_id?: string;
  license_plate?: string;
  vin?: string;
  engine_number?: string;
  color?: string;
  year?: number;
  mileage?: number;
  status?: string;
  registration_front_url?: string;
  registration_back_url?: string;
  insurance_card_url?: string;
};

export const fleetVehiclesService = {
  getAll: async () => {
    console.log('Fetching fleet vehicles with relations');
    
    const { data, error } = await supabase
      .from('fleet_vehicles')
      .select(`
        *,
        car_brands(id, name),
        car_models(id, name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching fleet vehicles:', error);
      throw new Error(error.message);
    }
    
    console.log('Fleet vehicles fetched successfully:', data);
    return data || [];
  },

  getById: async (id: string) => {
    console.log(`Fetching fleet vehicle with id ${id}`);
    
    const { data, error } = await supabase
      .from('fleet_vehicles')
      .select(`
        *,
        car_brands(id, name),
        car_models(id, name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching fleet vehicle with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    console.log('Fleet vehicle fetched successfully:', data);
    return data;
  },
  
  create: async (vehicle: NewFleetVehicle) => {
    console.log('Creating fleet vehicle:', vehicle);
    
    const { data, error } = await supabase
      .from('fleet_vehicles')
      .insert([vehicle])
      .select(`
        *,
        car_brands(id, name),
        car_models(id, name)
      `)
      .single();
    
    if (error) {
      console.error('Error creating fleet vehicle:', error);
      throw new Error(error.message);
    }
    
    console.log('Fleet vehicle created successfully:', data);
    return data;
  },
  
  update: async (id: string, vehicle: UpdateFleetVehicle) => {
    console.log(`Updating fleet vehicle with id ${id}:`, vehicle);
    
    const { data, error } = await supabase
      .from('fleet_vehicles')
      .update(vehicle)
      .eq('id', id)
      .select(`
        *,
        car_brands(id, name),
        car_models(id, name)
      `)
      .single();
    
    if (error) {
      console.error(`Error updating fleet vehicle with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    console.log('Fleet vehicle updated successfully:', data);
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('fleet_vehicles')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting fleet vehicle with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};
