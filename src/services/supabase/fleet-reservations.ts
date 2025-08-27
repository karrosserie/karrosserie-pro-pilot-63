
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type FleetReservation = Database['public']['Tables']['fleet_reservations']['Row'] & {
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    address?: string;
    postal_code?: string;
    city?: string;
  } | null;
  fleet_vehicles?: {
    id: string;
    brand_id: string;
    model_id: string;
    license_plate: string;
    color?: string;
    year: number;
    registration_front_url?: string;
    registration_back_url?: string;
    insurance_card_url?: string;
    car_brands?: {
      id: string;
      name: string;
    } | null;
    car_models?: {
      id: string;
      name: string;
    } | null;
  } | null;
};

export type NewFleetReservation = Database['public']['Tables']['fleet_reservations']['Insert'];
export type UpdateFleetReservation = Database['public']['Tables']['fleet_reservations']['Update'];

export const fleetReservationsService = {
  getAll: async (companyId?: string) => {
    console.log('Fetching fleet reservations with relations for company:', companyId);
    
    let query = supabase
      .from('fleet_reservations')
      .select(`
        *,
        clients(id, first_name, last_name, email, phone, address, postal_code, city),
        fleet_vehicles(
          id,
          brand_id,
          model_id,
          license_plate,
          color,
          year,
          registration_front_url,
          registration_back_url,
          insurance_card_url,
          car_brands(id, name),
          car_models(id, name)
        )
      `)
      .order('created_at', { ascending: false });
      
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching fleet reservations:', error);
      throw new Error(error.message);
    }
    
    console.log('Fleet reservations fetched successfully:', data);
    return data || [];
  },

  getById: async (id: string) => {
    console.log(`Fetching fleet reservation with id ${id}`);
    
    const { data, error } = await supabase
      .from('fleet_reservations')
      .select(`
        *,
        clients(id, first_name, last_name, email, phone, address, postal_code, city),
        fleet_vehicles(
          id,
          brand_id,
          model_id,
          license_plate,
          color,
          year,
          registration_front_url,
          registration_back_url,
          insurance_card_url,
          car_brands(id, name),
          car_models(id, name)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching fleet reservation with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    console.log('Fleet reservation fetched successfully:', data);
    return data;
  },

  getByVehicleId: async (vehicleId: string) => {
    console.log(`Fetching fleet reservations for vehicle ${vehicleId}`);
    
    const { data, error } = await supabase
      .from('fleet_reservations')
      .select(`
        *,
        clients(id, first_name, last_name, email, phone, address, postal_code, city),
        fleet_vehicles(
          id,
          brand_id,
          model_id,
          license_plate,
          color,
          year,
          registration_front_url,
          registration_back_url,
          insurance_card_url,
          car_brands(id, name),
          car_models(id, name)
        )
      `)
      .eq('fleet_vehicle_id', vehicleId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching fleet reservations for vehicle ${vehicleId}:`, error);
      throw new Error(error.message);
    }
    
    console.log('Fleet reservations fetched successfully:', data);
    return data || [];
  },
  
  create: async (reservation: NewFleetReservation) => {
    console.log('Creating fleet reservation:', reservation);
    
    const { data, error } = await supabase
      .from('fleet_reservations')
      .insert([reservation])
      .select(`
        *,
        clients(id, first_name, last_name, email, phone, address, postal_code, city),
        fleet_vehicles(
          id,
          brand_id,
          model_id,
          license_plate,
          color,
          year,
          registration_front_url,
          registration_back_url,
          insurance_card_url,
          car_brands(id, name),
          car_models(id, name)
        )
      `)
      .single();
    
    if (error) {
      console.error('Error creating fleet reservation:', error);
      throw new Error(error.message);
    }
    
    console.log('Fleet reservation created successfully:', data);
    return data;
  },
  
  update: async (id: string, reservation: UpdateFleetReservation) => {
    console.log(`Updating fleet reservation with id ${id}:`, reservation);
    
    const { data, error } = await supabase
      .from('fleet_reservations')
      .update(reservation)
      .eq('id', id)
      .select(`
        *,
        clients(id, first_name, last_name, email, phone, address, postal_code, city),
        fleet_vehicles(
          id,
          brand_id,
          model_id,
          license_plate,
          color,
          year,
          registration_front_url,
          registration_back_url,
          insurance_card_url,
          car_brands(id, name),
          car_models(id, name)
        )
      `)
      .single();
    
    if (error) {
      console.error(`Error updating fleet reservation with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    console.log('Fleet reservation updated successfully:', data);
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('fleet_reservations')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting fleet reservation with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};
