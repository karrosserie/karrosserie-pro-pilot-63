import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VehicleStatusPayload {
  repairOrderId: string;
  newStatus: string;
  oldStatus?: string;
  reason?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { repairOrderId, newStatus, oldStatus, reason }: VehicleStatusPayload = await req.json()

    console.log('Vehicle status monitor called:', { repairOrderId, newStatus, oldStatus, reason })

    // Récupérer les informations du repair_order
    const { data: repairOrder, error: repairOrderError } = await supabaseClient
      .from('repair_orders')
      .select(`
        id,
        company_id,
        vehicle_id,
        status,
        vehicles(
          license_plate,
          car_brands(name),
          car_models(name)
        )
      `)
      .eq('id', repairOrderId)
      .single()

    if (repairOrderError || !repairOrder) {
      console.error('Error fetching repair order:', repairOrderError)
      return new Response(
        JSON.stringify({ success: false, error: 'Repair order not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    const isWaitingStatus = newStatus === 'En attente' || newStatus.toLowerCase().includes('attente')
    const isCompletedStatus = newStatus === 'Signé' || newStatus === 'Terminé' || newStatus === 'En cours'
    const wasWaitingStatus = oldStatus === 'En attente' || (oldStatus && oldStatus.toLowerCase().includes('attente'))

    if (isWaitingStatus) {
      // Le véhicule passe en attente - créer une alerte
      const vehicle = repairOrder.vehicles
      const vehicleName = vehicle 
        ? `${vehicle.car_brands?.name || 'Marque inconnue'} ${vehicle.car_models?.name || 'Modèle inconnu'} - ${vehicle.license_plate}`
        : 'Véhicule inconnu'

      // Vérifier si une alerte existe déjà pour ce repair order spécifique
      const { data: existingAlert } = await supabaseClient
        .from('system_alerts')
        .select('id')
        .eq('company_id', repairOrder.company_id)
        .eq('entity_type', 'vehicle')
        .eq('vehicle_id', repairOrder.vehicle_id)
        .eq('repair_order_id', repairOrder.id)
        .eq('alert_type', 'vehicule_attente')
        .eq('resolved', false)
        .single()

      if (!existingAlert) {
        const baseMessage = `Le véhicule ${vehicleName} est en attente`
        const fullMessage = reason 
          ? `${baseMessage}. Raison : ${reason}`
          : `${baseMessage}. Vérifiez les causes du blocage.`

        const { error: insertError } = await supabaseClient
          .from('system_alerts')
          .insert({
            company_id: repairOrder.company_id,
            entity_type: 'vehicle',
            vehicle_id: repairOrder.vehicle_id,
            repair_order_id: repairOrder.id,
            alert_type: 'vehicule_attente',
            title: 'Véhicule en attente',
            message: fullMessage,
            reason: reason || null
          })

        if (insertError) {
          console.error('Error creating vehicle alert:', insertError)
        } else {
          console.log('✅ Vehicle waiting alert created for:', vehicleName)
        }
      }
    } else if (isCompletedStatus && wasWaitingStatus) {
      // Le véhicule n'est plus en attente - résoudre l'alerte
      const { error: resolveError } = await supabaseClient
        .from('system_alerts')
        .update({ 
          resolved: true, 
          resolved_at: new Date().toISOString() 
        })
        .eq('entity_type', 'vehicle')
        .eq('vehicle_id', repairOrder.vehicle_id)
        .eq('repair_order_id', repairOrder.id)
        .eq('alert_type', 'vehicule_attente')
        .eq('resolved', false)

      if (resolveError) {
        console.error('Error resolving vehicle alert:', resolveError)
      } else {
        console.log('✅ Vehicle waiting alert resolved')
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in vehicle status monitor:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})