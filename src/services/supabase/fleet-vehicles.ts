
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type FleetVehicle = Database['public']['Tables']['fleet_vehicles']['Row'] & {
  vin?: string;
  engine_number?: string;
  color?: string;
  mileage?: number;
  registration_front_url?: string;
  registration_back_url?: string;
  insurance_card_url?: string;
  // Support both old and new structure during migration
  brand?: string;
  model?: string;
  brand_id?: string;
  model_id?: string;
  car_brands?: {
    id: string;
    name: string;
  } | null;
  car_models?: {
    id: string;
    name: string;
  } | null;
};

export type NewFleetVehicle = Database['public']['Tables']['fleet_vehicles']['Insert'] & {
  vin?: string;
  engine_number?: string;
  color?: string;
  mileage?: number;
  registration_front_url?: string;
  registration_back_url?: string;
  insurance_card_url?: string;
  // Support both old and new structure during migration
  brand?: string;
  model?: string;
  brand_id?: string;
  model_id?: string;
};

export type UpdateFleetVehicle = Database['public']['Tables']['fleet_vehicles']['Update'] & {
  vin?: string;
  engine_number?: string;
  color?: string;
  mileage?: number;
  registration_front_url?: string;
  registration_back_url?: string;
  insurance_card_url?: string;
  brand?: string;
  model?: string;
  brand_id?: string;
  model_id?: string;
};

export const fleetVehiclesService = {
  getAll: async () => {
    console.log('Fetching fleet vehicles - trying new structure first');
    
    // Always use fallback to old structure since relations don't exist yet
    const { data, error } = await supabase
      .from('fleet_vehicles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching fleet vehicles:', error);
      throw new Error(error.message);
    }
    
    // Add missing relation properties to match FleetVehicle type
    const vehicles = data?.map(vehicle => ({
      ...vehicle,
      car_brands: null,
      car_models: null
    })) || [];
    
    console.log('Fleet vehicles fetched successfully (fallback structure):', vehicles);
    return vehicles;
  },

  getById: async (id: string) => {
    console.log(`Fetching fleet vehicle with id ${id} - using fallback structure`);
    
    const { data, error } = await supabase
      .from('fleet_vehicles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching fleet vehicle with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    // Add missing relation properties to match FleetVehicle type
    const vehicle = {
      ...data,
      car_brands: null,
      car_models: null
    };
    
    console.log('Fleet vehicle fetched successfully (fallback structure):', vehicle);
    return vehicle;
  },
  
  create: async (vehicle: NewFleetVehicle) => {
    console.log('Creating fleet vehicle - using fallback structure');
    
    const { data, error } = await supabase
      .from('fleet_vehicles')
      .insert([vehicle])
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating fleet vehicle:', error);
      throw new Error(error.message);
    }
    
    // Add missing relation properties to match FleetVehicle type
    const createdVehicle = {
      ...data,
      car_brands: null,
      car_models: null
    };
    
    console.log('Fleet vehicle created successfully (fallback structure):', createdVehicle);
    return createdVehicle;
  },
  
  update: async (id: string, vehicle: UpdateFleetVehicle) => {
    console.log(`Updating fleet vehicle with id ${id} - using fallback structure`);
    
    const { data, error } = await supabase
      .from('fleet_vehicles')
      .update(vehicle)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error(`Error updating fleet vehicle with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    // Add missing relation properties to match FleetVehicle type
    const updatedVehicle = {
      ...data,
      car_brands: null,
      car_models: null
    };
    
    console.log('Fleet vehicle updated successfully (fallback structure):', updatedVehicle);
    return updatedVehicle;
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
