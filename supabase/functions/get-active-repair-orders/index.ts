import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      repair_orders: any
      vehicles: any
      clients: any
      car_brands: any
      car_models: any
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract company_id from query parameters or request body
    let companyId: string;
    
    if (req.method === 'GET') {
      const url = new URL(req.url);
      companyId = url.searchParams.get('company_id') || '';
    } else if (req.method === 'POST') {
      const body = await req.json();
      companyId = body.company_id || '';
    } else {
      return new Response(
        JSON.stringify({ 
          error: 'Method not allowed. Use GET or POST.',
          details: 'Only GET and POST methods are supported'
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate company_id parameter
    if (!companyId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameter: company_id',
          details: 'Please provide a valid company_id in query parameters (GET) or request body (POST)'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient<Database>(supabaseUrl, supabaseKey)

    console.log(`Fetching active repair orders for company: ${companyId}`)

    // Fetch repair orders with active statuses (En cours, En attente and Signé) and filter by company_id
    const { data: repairOrders, error } = await supabase
      .from('repair_orders')
      .select(`
        *,
        vehicles (
          *,
          car_brands (
            id,
            name
          ),
          car_models (
            id,
            name
          )
        ),
        clients (
          id,
          first_name,
          last_name,
          email,
          phone,
          address,
          city,
          postal_code
        )
      `)
      .in('status', ['En cours', 'En attente', 'Signé'])
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching repair orders:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch repair orders',
          details: error.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Found ${repairOrders?.length || 0} active repair orders for company ${companyId}`)

    // Transform the data to have a cleaner structure
    const enrichedOrders = repairOrders?.map((order: any) => ({
      // Repair Order data
      id: order.id,
      reference: order.reference,
      status: order.status,
      notes: order.notes,
      start_date: order.start_date,
      end_date: order.end_date,
      arrival_date: order.arrival_date,
      order_date: order.order_date,
      incident_date: order.incident_date,
      report_date: order.report_date,
      signature_date: order.signature_date,
      created_at: order.created_at,
      updated_at: order.updated_at,
      company_id: order.company_id,
      
      // Additional repair order fields
      report_number: order.report_number,
      policy_number: order.policy_number,
      claim_number: order.claim_number,
      expert_name: order.expert_name,
      general_condition: order.general_condition,
      cleanliness_condition: order.cleanliness_condition,
      personal_items: order.personal_items,
      client_signature: order.client_signature,
      client_name_signature: order.client_name_signature,
      
      // Work data
      repairs_data: order.repairs_data,
      parts_data: order.parts_data,
      discounts_data: order.discounts_data,
      
      // Vehicle information
      vehicle: order.vehicles ? {
        id: order.vehicles.id,
        license_plate: order.vehicles.license_plate,
        vin: order.vehicles.vin,
        year: order.vehicles.year,
        color: order.vehicles.color,
        mileage: order.vehicles.mileage,
        fuel_level: order.vehicles.fuel_level,
        engine_number: order.vehicles.engine_number,
        status: order.vehicles.status,
        brand: order.vehicles.car_brands?.name || null,
        model: order.vehicles.car_models?.name || null,
        brand_id: order.vehicles.brand_id,
        model_id: order.vehicles.model_id,
        vehicle_images: order.vehicles.vehicle_images,
        work_items: order.vehicles.work_items,
        road_test: order.vehicles.road_test,
        road_test_notes: order.vehicles.road_test_notes,
        pre_accident_defects: order.vehicles.pre_accident_defects,
        insurance_expiry_date: order.vehicles.insurance_expiry_date,
        created_at: order.vehicles.created_at,
        updated_at: order.vehicles.updated_at
      } : null,
      
      // Client information
      client: order.clients ? {
        id: order.clients.id,
        first_name: order.clients.first_name,
        last_name: order.clients.last_name,
        full_name: `${order.clients.first_name} ${order.clients.last_name}`,
        email: order.clients.email,
        phone: order.clients.phone,
        address: order.clients.address,
        city: order.clients.city,
        postal_code: order.clients.postal_code
      } : null
    })) || []

    return new Response(
      JSON.stringify({ 
        success: true,
        data: enrichedOrders,
        count: enrichedOrders.length,
        company_id: companyId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})