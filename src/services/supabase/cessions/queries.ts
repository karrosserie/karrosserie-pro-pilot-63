
import { supabase } from '@/integrations/supabase/client';
import { Cession } from './types';
import { getCurrentUserCompanyId } from '../auth-company';

export const getAllCessions = async (): Promise<Cession[]> => {
  console.log('Fetching cessions...');
  
  // Get current user's company ID (handles impersonation)
  const companyId = await getCurrentUserCompanyId();
  console.log('Fetching cessions for company:', companyId);
  
  // Get cessions with insurance companies only (removing bank_accounts join)
  const { data: cessions, error } = await supabase
    .from('cessions')
    .select(`
      *,
      insurance_companies(name)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

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
                .select('first_name, last_name, address, city, postal_code, email, phone, driver_license_front_url, driver_license_back_url')
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
                  vin,
                  mileage,
                  registration_document_front_url,
                  registration_document_back_url,
                  vehicle_images,
                  car_brands(name),
                  car_models(name)
                `)
                .eq('id', repairOrder.vehicle_id)
                .single();
              vehicleData = vehicle;
            }
            
            // Get invoice amount and items for this repair order
            let invoiceAmount = 0;
            let repairOrderItems = { parts_data: null, repairs_data: null };
            
            const { data: invoice } = await supabase
              .from('invoices')
              .select('amount')
              .eq('repair_order_id', cession.repair_order_id)
              .single();
            
            if (invoice) {
              invoiceAmount = invoice.amount || 0;
            }
            
            // Get repair order items for calculations
            const { data: repairOrderWithItems } = await supabase
              .from('repair_orders')
              .select('parts_data, repairs_data')
              .eq('id', cession.repair_order_id)
              .single();
              
            if (repairOrderWithItems) {
              repairOrderItems = repairOrderWithItems;
            }
            
            repairOrderData = {
              reference: repairOrder.reference,
              created_at: repairOrder.created_at,
              amount: invoiceAmount,
              clients: clientData,
              vehicles: vehicleData,
              parts_data: repairOrderItems.parts_data,
              repairs_data: repairOrderItems.repairs_data
            };
          }
        } catch (error) {
          console.error(`Error in repair order enrichment for ${cession.repair_order_id}:`, error);
        }
      }
      
      // Map database response to Cession interface with proper defaults
      const cessionData = cession as any;
      return {
        ...cession,
        reference: cession.reference || '',
        status: cession.status || 'en_attente',
        repair_orders: repairOrderData,
        bank_accounts: null, // Set to null since we removed the join
        expertise_date: cessionData.expertise_date ?? null,
        expertise_amount: cessionData.expertise_amount ?? null,
        salvage_value: cessionData.salvage_value ?? null
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
        parts_data,
        repairs_data,
        clients(first_name, last_name, address, city, postal_code, email, phone, driver_license_front_url, driver_license_back_url),
        vehicles(
          license_plate,
          vin,
          mileage,
          registration_document_front_url,
          registration_document_back_url,
          vehicle_images,
          car_brands(name),
          car_models(name)
        )
      `)
      .eq('id', basicCession.repair_order_id)
      .single();
      
    // Get invoice amount for this repair order
    let invoiceAmount = 0;
    if (repairOrder) {
      const { data: invoice } = await supabase
        .from('invoices')
        .select('amount')
        .eq('repair_order_id', basicCession.repair_order_id)
        .single();
        
      if (invoice) {
        invoiceAmount = invoice.amount || 0;
      }
      
      // Add amount to repair order data
      repairOrderData = {
        ...repairOrder,
        amount: invoiceAmount
      };
    }
  }
  
  // Map database response to Cession interface with proper defaults
  const cessionData = basicCession as any;
  return {
    ...basicCession,
    reference: basicCession.reference || '',
    status: basicCession.status || 'en_attente',
    repair_orders: repairOrderData,
    bank_accounts: null, // Set to null since we removed the join
    expertise_date: cessionData.expertise_date ?? null,
    expertise_amount: cessionData.expertise_amount ?? null,
    salvage_value: cessionData.salvage_value ?? null
  } as Cession;
};
