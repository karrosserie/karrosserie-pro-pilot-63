
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type RepairOrder = Database['public']['Tables']['repair_orders']['Row'] & {
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  vehicles?: {
    id: string;
    license_plate: string;
    car_brands?: {
      id: string;
      name: string;
    };
    car_models?: {
      id: string;
      name: string;
    };
  } | null;
  quotes?: {
    id: string;
    reference: string;
    amount: number;
  } | null;
  repairs_data?: string | null;
  parts_data?: string | null;
  discounts_data?: string | null;
};

export type NewRepairOrder = Database['public']['Tables']['repair_orders']['Insert'];
export type UpdateRepairOrder = Database['public']['Tables']['repair_orders']['Update'];

export const repairOrdersService = {
  getAll: async () => {
    console.log('Fetching repair orders...');
    
    // Get basic repair orders data
    const { data: basicOrders, error: basicError } = await supabase
      .from('repair_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (basicError) {
      console.error('Error fetching repair orders:', basicError);
      throw new Error(basicError.message);
    }

    // Enrich with client and vehicle data separately
    const enrichedOrders = await Promise.all(
      (basicOrders || []).map(async (order) => {
        let clientData = null;
        let vehicleData = null;

        // Try to get client data
        if (order.client_id) {
          const { data: client } = await supabase
            .from('clients')
            .select('id, first_name, last_name')
            .eq('id', order.client_id)
            .single();
          clientData = client;
        }

        // Try to get vehicle data with brands and models
        if (order.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select(`
              id, 
              license_plate,
              car_brands(id, name),
              car_models(id, name)
            `)
            .eq('id', order.vehicle_id)
            .single();
          vehicleData = vehicle;
        }

        return {
          ...order,
          clients: clientData,
          vehicles: vehicleData,
          quotes: null
        };
      })
    );

    return enrichedOrders;
  },

  getById: async (id: string) => {
    console.log(`Fetching repair order with id ${id}...`);
    
    // Get basic order data
    const { data: basicOrder, error: basicError } = await supabase
      .from('repair_orders')
      .select('*')
      .eq('id', id)
      .single();
      
    if (basicError) {
      console.error(`Error fetching repair order with id ${id}:`, basicError);
      throw new Error(basicError.message);
    }
    
    // Enrich with client and vehicle data
    let clientData = null;
    let vehicleData = null;
    
    if (basicOrder.client_id) {
      const { data: client } = await supabase
        .from('clients')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          address,
          city,
          postal_code,
          driver_license_front_url,
          driver_license_back_url
        `)
        .eq('id', basicOrder.client_id)
        .single();
      clientData = client;
      console.log('Fetched client data separately:', clientData);
    }
    
    if (basicOrder.vehicle_id) {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select(`
          id,
          license_plate,
          car_brands(id, name),
          car_models(id, name),
          registration_document_front_url,
          registration_document_back_url
        `)
        .eq('id', basicOrder.vehicle_id)
        .single();
      vehicleData = vehicle;
      console.log('Fetched vehicle data separately:', vehicleData);
    }
    
    const enrichedOrder = {
      ...basicOrder,
      clients: clientData,
      vehicles: vehicleData,
      quotes: null
    };
    
    console.log('Final enriched order:', enrichedOrder);
    return enrichedOrder;
  },

  getLastOrderByUser: async () => {
    // Récupérer l'utilisateur actuel
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      throw new Error('User not authenticated');
    }

    const { data: order, error } = await supabase
      .from('repair_orders')
      .select('reference')
      .eq('user_id', user.id)
      .order('reference', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching last repair order:', error);
      throw new Error(error.message);
    }

    return order;
  },
  
  create: async (order: NewRepairOrder) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const orderWithUser = {
      ...order,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('repair_orders')
      .insert([orderWithUser])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating repair order:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, order: UpdateRepairOrder) => {
    const { data, error } = await supabase
      .from('repair_orders')
      .update(order)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating repair order with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('repair_orders')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting repair order with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};
