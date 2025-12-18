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
        email,
        phone,
        oodrive_recipient_id,
        client_type,
        company_name
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
      ),
      invoices!repair_order_id(id, reference)
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
        driver_license_back_url,
        client_type,
        company_name
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
      ),
      quotes(
        id,
        reference,
        amount,
        source_report_id,
        modificatif_report_id,
        report_id
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
  const { getCurrentUserCompanyId } = await import('../auth-company');
  const companyId = await getCurrentUserCompanyId();

  const { data: order, error } = await supabase
    .from('repair_orders')
    .select('reference')
    .eq('company_id', companyId)
    .order('reference', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching last repair order:', error);
    throw new Error(error.message);
  }

  return order;
};
