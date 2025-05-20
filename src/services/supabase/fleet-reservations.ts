
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type FleetReservation = Database['public']['Tables']['fleet_reservations']['Row'];
export type NewFleetReservation = Database['public']['Tables']['fleet_reservations']['Insert'];
export type UpdateFleetReservation = Database['public']['Tables']['fleet_reservations']['Update'];

export const fleetReservationsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('fleet_reservations')
      .select(`
        *,
        clients(first_name, last_name),
        fleet_vehicles(brand, model, license_plate),
        repair_orders(reference)
      `)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching fleet reservations:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('fleet_reservations')
      .select(`
        *,
        clients(id, first_name, last_name),
        fleet_vehicles(id, brand, model, license_plate),
        repair_orders(id, reference)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching fleet reservation with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  getByVehicleId: async (vehicleId: string) => {
    const { data, error } = await supabase
      .from('fleet_reservations')
      .select(`
        *,
        clients(first_name, last_name)
      `)
      .eq('fleet_vehicle_id', vehicleId)
      .order('start_date');
      
    if (error) {
      console.error(`Error fetching reservations for vehicle ${vehicleId}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  create: async (reservation: NewFleetReservation) => {
    const { data, error } = await supabase
      .from('fleet_reservations')
      .insert([reservation])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating fleet reservation:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, reservation: UpdateFleetReservation) => {
    const { data, error } = await supabase
      .from('fleet_reservations')
      .update(reservation)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating fleet reservation with id ${id}:`, error);
      throw new Error(error.message);
    }
    
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
