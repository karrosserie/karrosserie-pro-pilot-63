
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type FleetReturn = Database['public']['Tables']['fleet_returns']['Row'];
export type NewFleetReturn = Database['public']['Tables']['fleet_returns']['Insert'];
export type UpdateFleetReturn = Database['public']['Tables']['fleet_returns']['Update'];

export const fleetReturnsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('fleet_returns')
      .select(`
        *,
        clients(first_name, last_name, phone, email),
        fleet_vehicles(brand, model, license_plate),
        fleet_reservations(start_date, expected_return_date)
      `)
      .order('return_date', { ascending: false });

    if (error) {
      console.error('Error fetching fleet returns:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('fleet_returns')
      .select(`
        *,
        clients(id, first_name, last_name, phone, email),
        fleet_vehicles(id, brand, model, license_plate),
        fleet_reservations(start_date, expected_return_date)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching fleet return with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  getByReservationId: async (reservationId: string) => {
    const { data, error } = await supabase
      .from('fleet_returns')
      .select(`
        *,
        clients(first_name, last_name, phone, email)
      `)
      .eq('fleet_reservation_id', reservationId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error(`Error fetching return for reservation ${reservationId}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  create: async (fleetReturn: NewFleetReturn) => {
    const { data, error } = await supabase
      .from('fleet_returns')
      .insert([fleetReturn])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating fleet return:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, fleetReturn: UpdateFleetReturn) => {
    const { data, error } = await supabase
      .from('fleet_returns')
      .update(fleetReturn)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating fleet return with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('fleet_returns')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting fleet return with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};
