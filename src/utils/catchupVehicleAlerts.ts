import { supabase } from '@/integrations/supabase/client';

export const triggerAlertsForExistingWaitingVehicles = async () => {
  try {
    // Récupérer tous les repair orders en attente qui n'ont pas d'alerte
    const { data: waitingOrders, error } = await supabase
      .from('repair_orders')
      .select('id, status, vehicle_id')
      .ilike('status', '%attente%')
      .not('vehicle_id', 'is', null);

    if (error) {
      console.error('Error fetching waiting orders:', error);
      return;
    }

    console.log(`Found ${waitingOrders?.length || 0} waiting repair orders`);

    // Déclencher l'edge function pour chaque repair order
    for (const order of waitingOrders || []) {
      try {
        await supabase.functions.invoke('vehicle-status-monitor', {
          body: {
            repairOrderId: order.id,
            newStatus: order.status,
            oldStatus: null
          }
        });
        console.log(`✅ Alert triggered for repair order ${order.id}`);
      } catch (error) {
        console.error(`❌ Error triggering alert for repair order ${order.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in catchup process:', error);
  }
};