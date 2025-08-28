
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { demoFleetReservations, demoClients, demoFleetVehicles } from '@/data/demoData';

// Check if we're in demo mode (simplified check)
const isDemoMode = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname.includes('demo') ||
         process.env.NODE_ENV === 'development';
};

// Transform demo data to match the expected FleetReservation interface
const transformDemoDataToReservations = (reservations = demoFleetReservations, companyId?: string) => {
  let filteredReservations = reservations;
  
  // Filter by company if provided
  if (companyId) {
    filteredReservations = reservations.filter(reservation => reservation.company_id === companyId);
  }
  
  return filteredReservations.map(reservation => {
    // Find related data
    const client = demoClients.find(c => c.id === reservation.client_id);
    const vehicle = demoFleetVehicles.find(v => v.id === reservation.fleet_vehicle_id);

    return {
      ...reservation,
      clients: client ? {
        id: client.id,
        first_name: client.first_name,
        last_name: client.last_name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        postal_code: client.postal_code,
        city: client.city
      } : null,
      fleet_vehicles: vehicle ? {
        id: vehicle.id,
        brand_id: vehicle.brand_id,
        model_id: vehicle.model_id,
        license_plate: vehicle.license_plate,
        color: vehicle.color,
        year: vehicle.year,
        registration_front_url: vehicle.registration_front_url || null,
        registration_back_url: vehicle.registration_back_url || null,
        insurance_card_url: vehicle.insurance_card_url || null,
        car_brands: null, // Would need brand data from demo
        car_models: null  // Would need model data from demo
      } : null
    };
  });
};

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
    
    // In demo mode, return static data
    if (isDemoMode()) {
      console.log('Using demo fleet reservations data');
      const transformedReservations = transformDemoDataToReservations(demoFleetReservations, companyId);
      console.log('Demo fleet reservations loaded:', transformedReservations);
      return transformedReservations;
    }
    
    const baseQuery = supabase
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
          insurance_card_url
        )
      `);
      
    const queryBuilder = companyId 
      ? baseQuery.eq('company_id', companyId).order('created_at', { ascending: false })
      : baseQuery.order('created_at', { ascending: false });
    
    const { data, error } = await queryBuilder;
    
    if (error) {
      console.error('Error fetching fleet reservations:', error);
      // Fallback to demo data if Supabase fails
      console.log('Fallback to demo fleet reservations data');
      const transformedReservations = transformDemoDataToReservations(demoFleetReservations, companyId);
      return transformedReservations;
    }
    
    console.log('Fleet reservations fetched successfully:', data);
    return data || [];
  },

  getById: async (id: string) => {
    console.log(`Fetching fleet reservation with id ${id}`);
    
    // In demo mode, return static data
    if (isDemoMode()) {
      console.log('Using demo fleet reservations data for single reservation');
      const transformedReservations = transformDemoDataToReservations(demoFleetReservations);
      const reservation = transformedReservations.find(r => r.id === id);
      if (!reservation) {
        throw new Error(`Fleet reservation with id ${id} not found in demo data`);
      }
      return reservation;
    }
    
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
          insurance_card_url
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching fleet reservation with id ${id}:`, error);
      // Fallback to demo data if Supabase fails
      console.log('Fallback to demo fleet reservations data for single reservation');
      const transformedReservations = transformDemoDataToReservations(demoFleetReservations);
      const reservation = transformedReservations.find(r => r.id === id);
      if (!reservation) {
        throw new Error(`Fleet reservation with id ${id} not found in demo data`);
      }
      return reservation;
    }
    
    console.log('Fleet reservation fetched successfully:', data);
    return data;
  },

  getByVehicleId: async (vehicleId: string) => {
    console.log(`Fetching fleet reservations for vehicle ${vehicleId}`);
    
    // In demo mode, return static data
    if (isDemoMode()) {
      console.log('Using demo fleet reservations data for vehicle');
      const transformedReservations = transformDemoDataToReservations(demoFleetReservations);
      const vehicleReservations = transformedReservations.filter(r => r.fleet_vehicle_id === vehicleId);
      console.log('Demo fleet reservations for vehicle loaded:', vehicleReservations);
      return vehicleReservations;
    }
    
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
          insurance_card_url
        )
      `)
      .eq('fleet_vehicle_id', vehicleId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching fleet reservations for vehicle ${vehicleId}:`, error);
      // Fallback to demo data if Supabase fails
      console.log('Fallback to demo fleet reservations data for vehicle');
      const transformedReservations = transformDemoDataToReservations(demoFleetReservations);
      const vehicleReservations = transformedReservations.filter(r => r.fleet_vehicle_id === vehicleId);
      return vehicleReservations;
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
          insurance_card_url
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
          insurance_card_url
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
