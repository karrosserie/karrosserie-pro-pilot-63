import { supabase } from '@/integrations/supabase/client';

export const createMissingVehicleAlerts = async () => {
  try {
    console.log('🔍 Recherche des véhicules en attente sans alerte...');
    
    // Récupérer tous les véhicules en attente depuis employee_schedule avec leurs repair_orders éventuels
    const { data: waitingVehicles, error } = await supabase
      .from('employee_schedule')
      .select(`
        id,
        waiting_reason,
        vehicle_id,
        company_id,
        vehicles!inner(
          id,
          license_plate,
          car_brands(name),
          car_models(name),
          repair_orders!inner(
            id,
            status
          )
        )
      `)
      .not('waiting_reason', 'is', null)
      .not('vehicle_id', 'is', null);

    if (error) {
      console.error('❌ Erreur lors de la récupération des véhicules en attente:', error);
      return;
    }

    console.log(`📋 Trouvé ${waitingVehicles?.length || 0} véhicules en attente dans les étapes atelier`);

    if (!waitingVehicles || waitingVehicles.length === 0) {
      console.log('ℹ️ Aucun véhicule en attente trouvé');
      return;
    }

    // Pour chaque véhicule en attente, vérifier s'il a déjà une alerte
    for (const vehicleTask of waitingVehicles) {
      // Prendre le premier repair_order actif pour ce véhicule
      const repairOrder = vehicleTask.vehicles?.repair_orders?.[0];
      
      if (!repairOrder) {
        console.log(`⚠️ Pas de repair order trouvé pour le véhicule ${vehicleTask.vehicle_id}, on ignore`);
        continue;
      }

      // Vérifier si une alerte existe déjà pour ce véhicule/repair_order
      const { data: existingAlert, error: alertError } = await supabase
        .from('system_alerts')
        .select('id')
        .eq('entity_type', 'vehicle')
        .eq('vehicle_id', vehicleTask.vehicle_id)
        .eq('repair_order_id', repairOrder.id)
        .eq('alert_type', 'vehicule_attente')
        .eq('resolved', false)
        .single();

      if (alertError && alertError.code !== 'PGRST116') {
        console.error(`❌ Erreur lors de la vérification d'alerte pour véhicule ${vehicleTask.vehicle_id}:`, alertError);
        continue;
      }

      // Si pas d'alerte existante, en créer une
      if (!existingAlert) {
        const vehicle = vehicleTask.vehicles;
        const brandName = vehicle?.car_brands?.name || 'Marque inconnue';
        const modelName = vehicle?.car_models?.name || 'Modèle inconnu';
        const vehicleName = `${brandName} ${modelName} - ${vehicle?.license_plate}`;

        const { error: insertError } = await supabase
          .from('system_alerts')
          .insert({
            company_id: vehicleTask.company_id,
            entity_type: 'vehicle',
            employee_id: null,
            vehicle_id: vehicleTask.vehicle_id,
            repair_order_id: repairOrder.id,
            alert_type: 'vehicule_attente',
            title: 'Véhicule en attente - Étapes atelier',
            message: `Le véhicule ${vehicleName} est bloqué dans les étapes atelier. Raison: ${vehicleTask.waiting_reason}`,
            reason: vehicleTask.waiting_reason,
            clock_in_time: null
          });

        if (insertError) {
          console.error(`❌ Erreur lors de la création d'alerte pour ${vehicleName}:`, insertError);
        } else {
          console.log(`✅ Alerte créée pour ${vehicleName} (raison: ${vehicleTask.waiting_reason})`);
        }
      } else {
        console.log(`ℹ️ Alerte déjà existante pour véhicule ${vehicleTask.vehicle_id}`);
      }
    }

    console.log('🎉 Processus de création d\'alertes pour véhicules en attente terminé');
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
};