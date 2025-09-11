
import { supabase } from '@/integrations/supabase/client';
import { Cession } from './types';
import { calculateOrderAmount } from '@/components/repair-orders/utils/orderCalculations';

export const getAllCessions = async (): Promise<Cession[]> => {
  console.log('Fetching cessions...');
  
  // Get cessions with insurance companies only (removing bank_accounts join)
  // RLS policies handle company filtering automatically with impersonation
  const { data: cessions, error } = await supabase
    .from('cessions')
    .select(`
      *,
      insurance_companies(name)
    `)
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
            .select('reference, created_at, client_id, vehicle_id, client_signature, client_name_signature, signature_date')
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
            
            // Get repair order items for calculations
            const { data: repairOrderWithItems } = await supabase
              .from('repair_orders')
              .select('parts_data, repairs_data, discounts_data')
              .eq('id', cession.repair_order_id)
              .single();
              
            let repairOrderItems = { parts_data: null, repairs_data: null };
            let calculatedAmount = 0;
            
            if (repairOrderWithItems) {
              repairOrderItems = repairOrderWithItems;
              // Calculate amount from repair order data instead of invoice
              calculatedAmount = calculateOrderAmount(repairOrderWithItems);
            }
            
            repairOrderData = {
              reference: repairOrder.reference,
              created_at: repairOrder.created_at,
              amount: calculatedAmount,
              clients: clientData,
              vehicles: vehicleData,
              parts_data: repairOrderItems.parts_data,
              repairs_data: repairOrderItems.repairs_data,
              client_signature: repairOrder.client_signature,
              client_name_signature: repairOrder.client_name_signature,
              signature_date: repairOrder.signature_date
            };
          }
        } catch (error) {
          console.error(`Error in repair order enrichment for ${cession.repair_order_id}:`, error);
        }
      }
      
      // Get bank account data if bank_account_id exists
      let bankAccountData = null;
      if (cession.bank_account_id) {
        const { data: bankAccount } = await supabase
          .from('bank_accounts')
          .select('name, iban, bic, bank')
          .eq('id', cession.bank_account_id)
          .single();
        bankAccountData = bankAccount;
      }
      
      // Map database response to Cession interface with proper defaults
      const cessionData = cession as any;
      return {
        ...cession,
        reference: cession.reference || '',
        status: cession.status || 'en_attente',
        repair_orders: repairOrderData,
        bank_accounts: bankAccountData,
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
        client_signature,
        client_name_signature,
        signature_date,
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
      
    // Calculate amount from repair order data
    if (repairOrder) {
      const calculatedAmount = calculateOrderAmount(repairOrder);
      
      // Add amount to repair order data
      repairOrderData = {
        ...repairOrder,
        amount: calculatedAmount
      };
    }
  }
  
  // Get bank account data if bank_account_id exists
  let bankAccountData = null;
  if (basicCession.bank_account_id) {
    const { data: bankAccount } = await supabase
      .from('bank_accounts')
      .select('name, iban, bic, bank')
      .eq('id', basicCession.bank_account_id)
      .single();
    bankAccountData = bankAccount;
  }
  
  // Map database response to Cession interface with proper defaults
  const cessionData = basicCession as any;
  return {
    ...basicCession,
    reference: basicCession.reference || '',
    status: basicCession.status || 'en_attente',
    repair_orders: repairOrderData,
    bank_accounts: bankAccountData,
    expertise_date: cessionData.expertise_date ?? null,
    expertise_amount: cessionData.expertise_amount ?? null,
    salvage_value: cessionData.salvage_value ?? null
  } as Cession;
};
