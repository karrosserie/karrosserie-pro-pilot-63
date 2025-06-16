import { supabase } from '@/integrations/supabase/client';
import { RepairOrder } from './types';

export const getRepairOrders = async (): Promise<RepairOrder[]> => {
  console.log('Fetching repair orders...');
  
  const { data: orders, error } = await supabase
    .from('repair_orders')
    .select(`
      *,
      clients(
        id,
        first_name,
        last_name,
        email
      ),
      vehicles(
        id,
        license_plate,
        brand_id,
        model_id,
        car_brands(
          id,
          name
        ),
        car_models(
          id,
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching repair orders:', error);
    throw new Error(error.message);
  }

  console.log('Fetched repair orders with vehicle data:', orders);
  return orders || [];
};

export const getRepairOrderById = async (id: string): Promise<RepairOrder> => {
  console.log(`Fetching repair order with id ${id}...`);
  
  const { data: order, error } = await supabase
    .from('repair_orders')
    .select(`
      *,
      clients(
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
      ),
      vehicles(
        id,
        license_plate,
        brand_id,
        model_id,
        car_brands(
          id,
          name
        ),
        car_models(
          id,
          name
        ),
        registration_document_front_url,
        registration_document_back_url
      )
    `)
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching repair order with id ${id}:`, error);
    throw new Error(error.message);
  }
  
  console.log('Fetched repair order with complete data:', order);
  return order;
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
