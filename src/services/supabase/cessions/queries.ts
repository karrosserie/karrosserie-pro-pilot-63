
import { supabase } from '@/integrations/supabase/client';
import { Cession } from './types';

export const getAllCessions = async (): Promise<Cession[]> => {
  console.log('Fetching cessions...');
  
  // Get cessions with insurance companies
  const { data: cessions, error } = await supabase
    .from('cessions')
    .select(`
      *,
      insurance_companies(name)
    `)
    .order('sale_date', { ascending: false });

  if (error) {
    console.error('Error fetching cessions:', error);
    throw new Error(error.message);
  }
  
  console.log('Raw cessions data:', cessions);
  
  // Enrich each cession with repair order data
  const enrichedCessions = await Promise.all(
    (cessions || []).map(async (cession) => {
      let repairOrderData = null;
      
      if (cession.repair_order_id) {
        console.log(`Fetching repair order for cession ${cession.id}, repair_order_id: ${cession.repair_order_id}`);
        
        try {
          // First get the repair order
          const { data: repairOrder, error: repairOrderError } = await supabase
            .from('repair_orders')
            .select('reference, created_at, client_id, vehicle_id')
            .eq('id', cession.repair_order_id)
            .single();
            
          if (repairOrderError) {
            console.error(`Error fetching repair order ${cession.repair_order_id}:`, repairOrderError);
          } else if (repairOrder) {
            console.log('Repair order data:', repairOrder);
            
            // Get client data if client_id exists
            let clientData = null;
            if (repairOrder.client_id) {
              const { data: client } = await supabase
                .from('clients')
                .select('first_name, last_name')
                .eq('id', repairOrder.client_id)
                .single();
              clientData = client;
            }
            
            // Get vehicle data if vehicle_id exists
            let vehicleData = null;
            if (repairOrder.vehicle_id) {
              const { data: vehicle } = await supabase
                .from('vehicles')
                .select(`
                  license_plate,
                  car_brands(name),
                  car_models(name)
                `)
                .eq('id', repairOrder.vehicle_id)
                .single();
              vehicleData = vehicle;
            }
            
            repairOrderData = {
              reference: repairOrder.reference,
              created_at: repairOrder.created_at,
              clients: clientData,
              vehicles: vehicleData
            };
          }
        } catch (error) {
          console.error(`Error in repair order enrichment for ${cession.repair_order_id}:`, error);
        }
      }
      
      return {
        ...cession,
        reference: cession.reference || '',
        status: cession.status || 'en_attente',
        repair_orders: repairOrderData,
        sale_date: cession.sale_date || new Date().toISOString().split('T')[0],
        sale_price: cession.sale_price ?? 0,
        buyer_name: cession.buyer_name || '',
        buyer_contact: cession.buyer_contact || '',
        expertise_date: cession.expertise_date ?? null,
        expertise_amount: cession.expertise_amount ?? null,
        salvage_value: cession.salvage_value ?? null
      };
    })
  );
  
  console.log('Enriched cessions:', enrichedCessions);
  return enrichedCessions as Cession[];
};

export const getCessionById = async (id: string): Promise<Cession> => {
  // Get basic cession data
  const { data: basicCession, error: basicError } = await supabase
    .from('cessions')
    .select(`
      *,
      vehicles(
        id, 
        license_plate,
        car_brands(name),
        car_models(name)
      ),
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
        vehicles(
          license_plate,
          car_brands(name),
          car_models(name)
        )
      `)
      .eq('id', basicCession.repair_order_id)
      .single();
      
    repairOrderData = repairOrder;
  }
  
  // Transform data to match our interface
  return {
    ...basicCession,
    reference: basicCession.reference || '',
    status: basicCession.status || 'en_attente',
    repair_orders: repairOrderData,
    sale_date: basicCession.sale_date || new Date().toISOString().split('T')[0],
    sale_price: basicCession.sale_price ?? 0,
    buyer_name: basicCession.buyer_name || '',
    buyer_contact: basicCession.buyer_contact || '',
    expertise_date: basicCession.expertise_date ?? null,
    expertise_amount: basicCession.expertise_amount ?? null,
    salvage_value: basicCession.salvage_value ?? null
  } as Cession;
};
