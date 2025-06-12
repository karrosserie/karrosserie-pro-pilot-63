import { supabase } from '@/integrations/supabase/client';
import { Cession } from './types';

export const cessionQueries = {
  getAll: async (): Promise<Cession[]> => {
    console.log('Fetching cessions...');
    
    const { data, error } = await supabase
      .from('cessions')
      .select(`
        *,
        repair_orders (
          id,
          reference,
          clients (
            id,
            first_name,
            last_name
          ),
          vehicles (
            id,
            license_plate,
            car_brands(id, name),
            car_models(id, name)
          )
        ),
        insurance_companies (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cessions:', error);
      throw new Error(error.message);
    }

    // Transform the data to match the expected structure
    const transformedCessions = (data || []).map(cession => {
      const repairOrder = Array.isArray(cession.repair_orders) && cession.repair_orders.length > 0 
        ? cession.repair_orders[0] 
        : cession.repair_orders;

      let vehicleData = null;
      if (repairOrder?.vehicles) {
        const vehicle = Array.isArray(repairOrder.vehicles) && repairOrder.vehicles.length > 0 
          ? repairOrder.vehicles[0] 
          : repairOrder.vehicles;
        
        if (vehicle && vehicle.car_brands && vehicle.car_models) {
          vehicleData = {
            brand: vehicle.car_brands.name,
            model: vehicle.car_models.name,
            license_plate: vehicle.license_plate
          };
        }
      }

      return {
        ...cession,
        repair_orders: repairOrder,
        vehicles: vehicleData,
        insurance_companies: Array.isArray(cession.insurance_companies) && cession.insurance_companies.length > 0 
          ? cession.insurance_companies[0] 
          : cession.insurance_companies
      } as Cession;
    });

    return transformedCessions;
  },

  getCessionById: async (id: string): Promise<Cession> => {
    // Get basic cession data
    const { data: basicCession, error: basicError } = await supabase
      .from('cessions')
      .select(`
        *,
        vehicles(id, brand, model, license_plate),
        insurance_companies(name)
      `)
      .eq('id', id)
      .single();
      
    if (basicError) {
      console.error(`Error fetching cession with id ${id}:`, basicError);
      throw new Error(basicError.message);
    }
    
    // Enrich with repair order data if exists
    let repairOrderData = null;
    if (basicCession.repair_order_id) {
      const { data: repairOrder } = await supabase
        .from('repair_orders')
        .select(`
          reference,
          created_at,
          clients(first_name, last_name),
          vehicles(brand, model, license_plate)
        `)
        .eq('id', basicCession.repair_order_id)
        .single();
        
      repairOrderData = repairOrder;
    }
    
    // Transform data to match our interface
    return {
      ...basicCession,
      reference: (basicCession as any).reference || '',
      status: (basicCession as any).status || 'en_attente',
      repair_orders: repairOrderData
    } as Cession;
  }
};
