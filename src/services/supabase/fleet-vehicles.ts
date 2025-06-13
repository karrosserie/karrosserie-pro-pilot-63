
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
  car_brands?: {
    id: string;
    name: string;
  };
  car_models?: {
    id: string;
    name: string;
  };
};

export type NewFleetVehicle = Database['public']['Tables']['fleet_vehicles']['Insert'] & {
  vin?: string;
  engine_number?: string;
  color?: string;
  mileage?: number;
  registration_front_url?: string;
  registration_back_url?: string;
  insurance_card_url?: string;
};

export type UpdateFleetVehicle = Database['public']['Tables']['fleet_vehicles']['Update'] & {
  vin?: string;
  engine_number?: string;
  color?: string;
  mileage?: number;
  registration_front_url?: string;
  registration_back_url?: string;
  insurance_card_url?: string;
};

export const fleetVehiclesService = {
  getAll: async () => {
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
    
    return data;
  },

  getById: async (id: string) => {
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
    
    return data;
  },
  
  create: async (vehicle: NewFleetVehicle) => {
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
    
    return data;
  },
  
  update: async (id: string, vehicle: UpdateFleetVehicle) => {
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
