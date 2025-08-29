import { supabase } from '@/integrations/supabase/client';

export interface FleetViolation {
  id: string;
  fleet_vehicle_id: string;
  license_plate: string;
  violation_date: string;
  violation_time?: string;
  location?: string;
  violation_type: string;
  fine_amount: number;
  payment_status: string;
  reference_number?: string;
  due_date?: string;
  notes?: string;
  document_url?: string;
  borrower_name?: string;
  borrower_phone?: string;
  borrower_email?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  fleet_vehicles?: {
    license_plate: string;
    car_brands: {
      name: string;
    } | null;
    car_models: {
      name: string;
    } | null;
  } | null;
  points_lost?: number;
}

export interface NewFleetViolation {
  fleet_vehicle_id: string;
  license_plate: string;
  violation_date: string;
  violation_time?: string;
  location?: string;
  violation_type: string;
  fine_amount: number;
  payment_status?: string;
  reference_number?: string;
  due_date?: string;
  notes?: string;
  document_url?: string;
  borrower_name?: string;
  borrower_phone?: string;
  borrower_email?: string;
  company_id: string;
  points_lost?: number;
}

export interface UpdateFleetViolation {
  license_plate?: string;
  violation_date?: string;
  violation_time?: string;
  location?: string;
  violation_type?: string;
  fine_amount?: number;
  payment_status?: string;
  reference_number?: string;
  due_date?: string;
  notes?: string;
  document_url?: string;
  borrower_name?: string;
  borrower_phone?: string;
  borrower_email?: string;
  points_lost?: number;
}

export const fleetViolationsService = {
  async getAll(): Promise<FleetViolation[]> {
    const { data, error } = await supabase
      .from('fleet_violations')
      .select(`
        *,
        fleet_vehicles:fleet_vehicle_id (
          license_plate,
          car_brands:brand_id (
            name
          ),
          car_models:model_id (
            name
          )
        )
      `)
      .order('violation_date', { ascending: false });

    if (error) {
      console.error('Error fetching fleet violations:', error);
      throw error;
    }

    return (data || []) as unknown as FleetViolation[];
  },

  async getAllWithLoans(): Promise<FleetViolation[]> {
    const { data, error } = await supabase
      .from('fleet_violations')
      .select(`
        *,
        fleet_vehicles:fleet_vehicle_id (
          license_plate,
          car_brands:brand_id (
            name
          ),
          car_models:model_id (
            name
          ),
          fleet_reservations!inner (
            id,
            start_date,
            expected_return_date,
            actual_return_date,
            status,
            clients (
              id,
              first_name,
              last_name,
              email,
              phone,
              license_number,
              license_issue_date,
              prefecture,
              date_of_birth,
              place_of_birth,
              driver_license_front_url,
              driver_license_back_url
            )
          )
        )
      `)
      .order('violation_date', { ascending: false });

    if (error) {
      console.error('Error fetching fleet violations with loans:', error);
      throw error;
    }

    return (data || []) as unknown as FleetViolation[];
  },

  async getById(id: string): Promise<FleetViolation | null> {
    const { data, error } = await supabase
      .from('fleet_violations')
      .select(`
        *,
        fleet_vehicles:fleet_vehicle_id (
          license_plate,
          car_brands:brand_id (
            name
          ),
          car_models:model_id (
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching fleet violation:', error);
      throw error;
    }

    return data as unknown as FleetViolation;
  },

  async getByVehicleId(vehicleId: string): Promise<FleetViolation[]> {
    const { data, error } = await supabase
      .from('fleet_violations')
      .select(`
        *,
        fleet_vehicles:fleet_vehicle_id (
          license_plate,
          car_brands:brand_id (
            name
          ),
          car_models:model_id (
            name
          )
        )
      `)
      .eq('fleet_vehicle_id', vehicleId)
      .order('violation_date', { ascending: false });

    if (error) {
      console.error('Error fetching vehicle violations:', error);
      throw error;
    }

    return (data || []) as unknown as FleetViolation[];
  },

  async create(violation: NewFleetViolation): Promise<FleetViolation> {
    const { data, error } = await supabase
      .from('fleet_violations')
      .insert(violation)
      .select(`
        *,
        fleet_vehicles:fleet_vehicle_id (
          license_plate,
          car_brands:brand_id (
            name
          ),
          car_models:model_id (
            name
          )
        )
      `)
      .single();

    if (error) {
      console.error('Error creating fleet violation:', error);
      throw error;
    }

    return data as unknown as FleetViolation;
  },

  async update(id: string, violation: UpdateFleetViolation): Promise<FleetViolation> {
    const { data, error } = await supabase
      .from('fleet_violations')
      .update(violation)
      .eq('id', id)
      .select(`
        *,
        fleet_vehicles:fleet_vehicle_id (
          license_plate,
          car_brands:brand_id (
            name
          ),
          car_models:model_id (
            name
          )
        )
      `)
      .single();

    if (error) {
      console.error('Error updating fleet violation:', error);
      throw error;
    }

    return data as unknown as FleetViolation;
  },

  async findConductorForViolation(violationId: string): Promise<any> {
    const { data: violation, error: violationError } = await supabase
      .from('fleet_violations')
      .select('*')
      .eq('id', violationId)
      .single();

    if (violationError || !violation) {
      throw new Error('Violation not found');
    }

    // Chercher les prêts qui correspondent à la période de l'infraction
    const violationDateTime = new Date(`${violation.violation_date}T${violation.violation_time || '12:00:00'}`);
    
    const { data: reservations, error: reservationError } = await supabase
      .from('fleet_reservations')
      .select(`
        *,
        clients (
          id,
          first_name,
          last_name,
          email,
          phone,
          license_number,
          license_issue_date,
          prefecture,
          date_of_birth,
          place_of_birth,
          driver_license_front_url,
          driver_license_back_url
        )
      `)
      .eq('fleet_vehicle_id', violation.fleet_vehicle_id)
      .lte('start_date', violationDateTime.toISOString())
      .or(`expected_return_date.gte.${violationDateTime.toISOString()},actual_return_date.gte.${violationDateTime.toISOString()},expected_return_date.is.null,actual_return_date.is.null`);

    if (reservationError) {
      console.error('Error finding reservations:', reservationError);
      throw reservationError;
    }

    return reservations && reservations.length > 0 ? {
      violation,
      reservation: reservations[0],
      conductor: reservations[0].clients
    } : null;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('fleet_violations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting fleet violation:', error);
      throw error;
    }
  }
};