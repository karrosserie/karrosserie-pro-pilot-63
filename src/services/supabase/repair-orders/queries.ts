
import { supabase } from '@/integrations/supabase/client';
import { RepairOrder } from './types';

export const getRepairOrders = async (): Promise<RepairOrder[]> => {
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
          .select('id, first_name, last_name, email')
          .eq('id', order.client_id)
          .single();
        clientData = client;
      }

      // Try to get vehicle data with brands and models, including the brand and model fields
      if (order.vehicle_id) {
        const { data: vehicle } = await supabase
          .from('vehicles')
          .select(`
            id, 
            license_plate,
            brand,
            model,
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
};

export const getRepairOrderById = async (id: string): Promise<RepairOrder> => {
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
        brand,
        model,
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
};

export const getLastOrderByUser = async () => {
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
};
