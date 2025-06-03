
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
    brand: string;
    model: string;
    license_plate: string;
  } | null;
  quotes?: {
    id: string;
    reference: string;
    amount: number;
  } | null;
};

export type NewRepairOrder = Database['public']['Tables']['repair_orders']['Insert'];
export type UpdateRepairOrder = Database['public']['Tables']['repair_orders']['Update'];

export const repairOrdersService = {
  getAll: async () => {
    console.log('Fetching repair orders...');
    
    // First, try to get repair orders with joins
    const { data: ordersWithJoins, error: joinError } = await supabase
      .from('repair_orders')
      .select(`
        *,
        clients (
          id,
          first_name,
          last_name
        ),
        vehicles (
          id,
          brand,
          model,
          license_plate
        ),
        quotes (
          id,
          reference,
          amount
        )
      `)
      .order('created_at', { ascending: false });

    // If joins fail, fall back to basic query
    if (joinError) {
      console.log('Joins failed, falling back to basic query:', joinError);
      
      const { data: basicOrders, error: basicError } = await supabase
        .from('repair_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (basicError) {
        console.error('Error fetching repair orders (basic):', basicError);
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

          // Try to get vehicle data
          if (order.vehicle_id) {
            const { data: vehicle } = await supabase
              .from('vehicles')
              .select('id, brand, model, license_plate')
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
    }
    
    return ordersWithJoins;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('repair_orders')
      .select(`
        *,
        clients (
          id,
          first_name,
          last_name
        ),
        vehicles (
          id,
          brand,
          model,
          license_plate
        ),
        quotes (
          id,
          reference,
          amount
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching repair order with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
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
