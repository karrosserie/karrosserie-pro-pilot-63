
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

// Helper function to transform legacy data to new structure
const transformLegacyVehicle = (vehicle: any): FleetVehicle => {
  // If the vehicle already has brand_id/model_id, return as is
  if (vehicle.brand_id && vehicle.model_id) {
    return vehicle as FleetVehicle;
  }
  
  // Transform legacy data with brand/model to new structure
  return {
    id: vehicle.id,
    brand_id: vehicle.brand_id || '', // Will need to be properly mapped
    model_id: vehicle.model_id || '', // Will need to be properly mapped
    license_plate: vehicle.license_plate,
    color: vehicle.color,
    year: vehicle.year,
    vin: vehicle.vin,
    engine_number: vehicle.engine_number,
    mileage: vehicle.mileage,
    status: vehicle.status,
    insurance_card_url: vehicle.insurance_card_url,
    registration_front_url: vehicle.registration_front_url,
    registration_back_url: vehicle.registration_back_url,
    created_at: vehicle.created_at,
    updated_at: vehicle.updated_at,
    user_id: vehicle.user_id,
    car_brands: vehicle.car_brands || (vehicle.brand ? { id: '', name: vehicle.brand } : null),
    car_models: vehicle.car_models || (vehicle.model ? { id: '', name: vehicle.model } : null)
  };
};

// Helper function to transform new data to legacy format for database operations
const transformToLegacyFormat = async (data: NewFleetVehicle | UpdateFleetVehicle) => {
  const legacyData = { ...data };
  
  // Get brand and model names from IDs if they exist
  if ('brand_id' in data && data.brand_id) {
    const brandResult = await supabase
      .from('car_brands')
      .select('name')
      .eq('id', data.brand_id)
      .single();
    
    if (brandResult.data) {
      legacyData.brand = brandResult.data.name;
    }
  }
  
  if ('model_id' in data && data.model_id) {
    const modelResult = await supabase
      .from('car_models')
      .select('name')
      .eq('id', data.model_id)
      .single();
    
    if (modelResult.data) {
      legacyData.model = modelResult.data.name;
    }
  }
  
  // Remove the new fields that don't exist in legacy schema
  delete legacyData.brand_id;
  delete legacyData.model_id;
  
  return legacyData;
};

export const fleetVehiclesService = {
  getAll: async () => {
    console.log('Fetching fleet vehicles with relations');
    
    // Try the new structure first
    let { data, error } = await supabase
      .from('fleet_vehicles')
      .select(`
        *,
        car_brands(id, name),
        car_models(id, name)
      `)
      .order('created_at', { ascending: false });
    
    // If that fails, try the legacy structure
    if (error || !data) {
      console.log('Trying legacy fleet_vehicles structure');
      const legacyResult = await supabase
        .from('fleet_vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (legacyResult.error) {
        console.error('Error fetching fleet vehicles:', legacyResult.error);
        throw new Error(legacyResult.error.message);
      }
      
      // Transform legacy data
      const transformedData = (legacyResult.data || []).map(transformLegacyVehicle);
      console.log('Fleet vehicles fetched successfully (legacy):', transformedData);
      return transformedData;
    }
    
    // Transform data to ensure consistent structure
    const transformedData = (data || []).map(transformLegacyVehicle);
    console.log('Fleet vehicles fetched successfully:', transformedData);
    return transformedData;
  },

  getById: async (id: string) => {
    console.log(`Fetching fleet vehicle with id ${id}`);
    
    // Try the new structure first
    let { data, error } = await supabase
      .from('fleet_vehicles')
      .select(`
        *,
        car_brands(id, name),
        car_models(id, name)
      `)
      .eq('id', id)
      .single();
    
    // If that fails, try the legacy structure
    if (error) {
      console.log('Trying legacy fleet_vehicles structure for single vehicle');
      const legacyResult = await supabase
        .from('fleet_vehicles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (legacyResult.error) {
        console.error(`Error fetching fleet vehicle with id ${id}:`, legacyResult.error);
        throw new Error(legacyResult.error.message);
      }
      
      const transformedData = transformLegacyVehicle(legacyResult.data);
      console.log('Fleet vehicle fetched successfully (legacy):', transformedData);
      return transformedData;
    }
    
    const transformedData = transformLegacyVehicle(data);
    console.log('Fleet vehicle fetched successfully:', transformedData);
    return transformedData;
  },
  
  create: async (vehicle: NewFleetVehicle) => {
    console.log('Creating fleet vehicle:', vehicle);
    
    // Transform to legacy format for database insertion
    const legacyVehicle = await transformToLegacyFormat(vehicle);
    
    const { data, error } = await supabase
      .from('fleet_vehicles')
      .insert(legacyVehicle)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating fleet vehicle:', error);
      throw new Error(error.message);
    }
    
    const transformedData = transformLegacyVehicle(data);
    console.log('Fleet vehicle created successfully:', transformedData);
    return transformedData;
  },
  
  update: async (id: string, vehicle: UpdateFleetVehicle) => {
    console.log(`Updating fleet vehicle with id ${id}:`, vehicle);
    
    // Transform to legacy format for database update
    const legacyVehicle = await transformToLegacyFormat(vehicle);
    
    const { data, error } = await supabase
      .from('fleet_vehicles')
      .update(legacyVehicle)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error(`Error updating fleet vehicle with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    const transformedData = transformLegacyVehicle(data);
    console.log('Fleet vehicle updated successfully:', transformedData);
    return transformedData;
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
