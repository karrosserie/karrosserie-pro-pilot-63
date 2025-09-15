import { supabase } from '@/integrations/supabase/client';

export const createMissingVehicleAlerts = async () => {
  try {
    console.log('🔍 Recherche des repair orders en attente sans alerte...');
    
    // Récupérer tous les repair orders en attente qui n'ont pas d'alerte système
    const { data: waitingOrders, error } = await supabase
      .from('repair_orders')
      .select(`
        id,
        status,
        vehicle_id,
        company_id,
        vehicles(
          license_plate,
          car_brands(name),
          car_models(name)
        )
      `)
      .ilike('status', '%attente%')
      .not('vehicle_id', 'is', null);

    if (error) {
      console.error('❌ Erreur lors de la récupération des repair orders:', error);
      return;
    }

    console.log(`📋 Trouvé ${waitingOrders?.length || 0} repair orders en attente avec véhicule`);

    if (!waitingOrders || waitingOrders.length === 0) {
      console.log('ℹ️ Aucun repair order en attente avec véhicule trouvé');
      return;
    }

    // Pour chaque repair order, vérifier s'il a déjà une alerte
    for (const order of waitingOrders) {
      // Vérifier si une alerte existe déjà
      const { data: existingAlert, error: alertError } = await supabase
        .from('system_alerts')
        .select('id')
        .eq('entity_type', 'vehicle')
        .eq('vehicle_id', order.vehicle_id)
        .eq('repair_order_id', order.id)
        .eq('alert_type', 'vehicule_attente')
        .eq('resolved', false)
        .single();

      if (alertError && alertError.code !== 'PGRST116') {
        console.error(`❌ Erreur lors de la vérification d'alerte pour ${order.id}:`, alertError);
        continue;
      }

      // Si pas d'alerte existante, en créer une
      if (!existingAlert) {
        const vehicle = order.vehicles;
        const vehicleName = vehicle 
          ? `${vehicle.car_brands?.name || 'Marque inconnue'} ${vehicle.car_models?.name || 'Modèle inconnu'} - ${vehicle.license_plate}`
          : 'Véhicule inconnu';

        const { error: insertError } = await supabase
          .from('system_alerts')
          .insert({
            company_id: order.company_id,
            entity_type: 'vehicle',
            vehicle_id: order.vehicle_id,
            repair_order_id: order.id,
            alert_type: 'vehicule_attente',
            title: 'Véhicule en attente',
            message: `Le véhicule ${vehicleName} est en attente. Vérifiez les causes du blocage.`,
            reason: 'Génération automatique d\'alerte manquante'
          });

        if (insertError) {
          console.error(`❌ Erreur lors de la création d'alerte pour ${vehicleName}:`, insertError);
        } else {
          console.log(`✅ Alerte créée pour ${vehicleName} (${order.id})`);
        }
      } else {
        console.log(`ℹ️ Alerte déjà existante pour repair order ${order.id}`);
      }
    }

    console.log('🎉 Processus de création d\'alertes manquantes terminé');
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
};