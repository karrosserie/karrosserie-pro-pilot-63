
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
    // Try new structure first, fall back to old structure
    let { data, error } = await supabase
      .from('fleet_vehicles')
      .select(`
        *,
        car_brands!inner(id, name),
        car_models!inner(id, name)
      `)
      .order('created_at', { ascending: false });

    // If error with relations, try without relations (old structure)
    if (error && error.code === 'PGRST200') {
      console.log('Falling back to old structure without relations');
      const result = await supabase
        .from('fleet_vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (result.error) {
        console.error('Error fetching fleet vehicles:', result.error);
        throw new Error(result.error.message);
      }
      
      // Add missing relation properties to match FleetVehicle type
      data = result.data?.map(vehicle => ({
        ...vehicle,
        car_brands: null,
        car_models: null
      })) || [];
      error = null;
    }

    if (error) {
      console.error('Error fetching fleet vehicles:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  getById: async (id: string) => {
    // Try new structure first, fall back to old structure
    let { data, error } = await supabase
      .from('fleet_vehicles')
      .select(`
        *,
        car_brands!inner(id, name),
        car_models!inner(id, name)
      `)
      .eq('id', id)
      .single();

    // If error with relations, try without relations (old structure)
    if (error && error.code === 'PGRST200') {
      console.log('Falling back to old structure without relations');
      const result = await supabase
        .from('fleet_vehicles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (result.error) {
        console.error(`Error fetching fleet vehicle with id ${id}:`, result.error);
        throw new Error(result.error.message);
      }
      
      // Add missing relation properties to match FleetVehicle type
      data = {
        ...result.data,
        car_brands: null,
        car_models: null
      };
      error = null;
    }
      
    if (error) {
      console.error(`Error fetching fleet vehicle with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  create: async (vehicle: NewFleetVehicle) => {
    // Try new structure first, fall back to old structure
    let { data, error } = await supabase
      .from('fleet_vehicles')
      .insert([vehicle])
      .select(`
        *,
        car_brands!inner(id, name),
        car_models!inner(id, name)
      `)
      .single();

    // If error with relations, try without relations (old structure)
    if (error && error.code === 'PGRST200') {
      console.log('Falling back to old structure without relations');
      const result = await supabase
        .from('fleet_vehicles')
        .insert([vehicle])
        .select('*')
        .single();
      
      if (result.error) {
        console.error('Error creating fleet vehicle:', result.error);
        throw new Error(result.error.message);
      }
      
      // Add missing relation properties to match FleetVehicle type
      data = {
        ...result.data,
        car_brands: null,
        car_models: null
      };
      error = null;
    }
      
    if (error) {
      console.error('Error creating fleet vehicle:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, vehicle: UpdateFleetVehicle) => {
    // Try new structure first, fall back to old structure
    let { data, error } = await supabase
      .from('fleet_vehicles')
      .update(vehicle)
      .eq('id', id)
      .select(`
        *,
        car_brands!inner(id, name),
        car_models!inner(id, name)
      `)
      .single();

    // If error with relations, try without relations (old structure)
    if (error && error.code === 'PGRST200') {
      console.log('Falling back to old structure without relations');
      const result = await supabase
        .from('fleet_vehicles')
        .update(vehicle)
        .eq('id', id)
        .select('*')
        .single();
      
      if (result.error) {
        console.error(`Error updating fleet vehicle with id ${id}:`, result.error);
        throw new Error(result.error.message);
      }
      
      // Add missing relation properties to match FleetVehicle type
      data = {
        ...result.data,
        car_brands: null,
        car_models: null
      };
      error = null;
    }
      
    if (error) {
      console.error(`Error updating fleet vehicle with id ${id}:`, error);
      throw new Error(error.message);
    }
    
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
