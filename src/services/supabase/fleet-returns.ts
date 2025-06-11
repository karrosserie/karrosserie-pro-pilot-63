
import { supabase } from '@/integrations/supabase/client';

// Types temporaires pour fleet_returns (jusqu'à ce que la migration soit appliquée)
export type FleetReturn = {
  id: string;
  fleet_reservation_id: string;
  fleet_vehicle_id: string;
  client_id: string;
  user_id: string;
  return_date: string;
  return_mileage: number;
  fuel_level_return: number;
  notes: string | null;
  status: string;
  vehicle_images: any;
  damages: any;
  attestation_accepted: boolean;
  client_signature: string | null;
  client_name: string | null;
  created_at: string;
  updated_at: string;
};

export type NewFleetReturn = Omit<FleetReturn, 'id' | 'created_at' | 'updated_at'>;
export type UpdateFleetReturn = Partial<Omit<FleetReturn, 'id' | 'created_at' | 'updated_at'>>;

export const fleetReturnsService = {
  getAll: async () => {
    // Simulation temporaire - retourner un tableau vide
    console.log('Fleet returns service - getAll called (simulation)');
    return [];
  },

  getById: async (id: string) => {
    console.log(`Fleet returns service - getById called with id: ${id} (simulation)`);
    return null;
  },
  
  getByReservationId: async (reservationId: string) => {
    console.log(`Fleet returns service - getByReservationId called with reservationId: ${reservationId} (simulation)`);
    return null;
  },
  
  create: async (fleetReturn: NewFleetReturn) => {
    console.log('Fleet returns service - create called (simulation)', fleetReturn);
    // Simulation de création réussie
    return {
      id: 'temp-' + Date.now(),
      ...fleetReturn,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as FleetReturn;
  },
  
  update: async (id: string, fleetReturn: UpdateFleetReturn) => {
    console.log(`Fleet returns service - update called with id: ${id} (simulation)`, fleetReturn);
    return null;
  },
  
  delete: async (id: string) => {
    console.log(`Fleet returns service - delete called with id: ${id} (simulation)`);
    return true;
  }
};
