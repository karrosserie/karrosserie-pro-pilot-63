
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type FleetReturn = Database['public']['Tables']['fleet_returns']['Row'];
export type NewFleetReturn = Database['public']['Tables']['fleet_returns']['Insert'];
export type UpdateFleetReturn = Database['public']['Tables']['fleet_returns']['Update'];

export const fleetReturnsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('fleet_returns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching fleet returns:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('fleet_returns')
      .select('*')
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
      .select('*')
      .eq('fleet_reservation_id', reservationId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No return found for this reservation
        return null;
      }
      console.error(`Error fetching fleet return for reservation ${reservationId}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  create: async (fleetReturn: NewFleetReturn) => {
    console.log('Creating fleet return:', fleetReturn);
    
    // Start a transaction to handle multiple updates
    const { data: returnData, error: returnError } = await supabase
      .from('fleet_returns')
      .insert([fleetReturn])
      .select()
      .single();
      
    if (returnError) {
      console.error('Error creating fleet return:', returnError);
      throw new Error(returnError.message);
    }
    
    // Update the fleet vehicle status to "Disponible"
    const { error: vehicleError } = await supabase
      .from('fleet_vehicles')
      .update({ status: 'Disponible' })
      .eq('id', fleetReturn.fleet_vehicle_id);
      
    if (vehicleError) {
      console.error('Error updating vehicle status:', vehicleError);
      throw new Error(vehicleError.message);
    }
    
    // Update the reservation status to "completed"
    const { error: reservationError } = await supabase
      .from('fleet_reservations')
      .update({ 
        status: 'completed',
        actual_return_date: fleetReturn.return_date,
        end_mileage: fleetReturn.return_mileage,
        fuel_level_end: fleetReturn.fuel_level_return
      })
      .eq('id', fleetReturn.fleet_reservation_id);
      
    if (reservationError) {
      console.error('Error updating reservation status:', reservationError);
      throw new Error(reservationError.message);
    }
    
    console.log('Fleet return created successfully:', returnData);
    return returnData;
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
