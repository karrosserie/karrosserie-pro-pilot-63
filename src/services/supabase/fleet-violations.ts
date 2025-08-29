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