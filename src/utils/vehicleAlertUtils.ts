import { supabase } from '@/integrations/supabase/client';

interface VehicleAlertData {
  companyId: string;
  vehicleId: string;
  repairOrderId: string;
  reason?: string;
  vehicleName?: string;
}

export const createVehicleWaitingAlert = async (data: VehicleAlertData): Promise<boolean> => {
  try {
    // Vérifier si une alerte existe déjà pour ce véhicule
    const { data: existingAlert, error: checkError } = await supabase
      .from('system_alerts')
      .select('id')
      .eq('company_id', data.companyId)
      .eq('entity_type', 'vehicle')
      .eq('vehicle_id', data.vehicleId)
      .eq('repair_order_id', data.repairOrderId)
      .eq('alert_type', 'vehicule_attente')
      .eq('resolved', false)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing alert:', checkError);
      return false;
    }

    // Si une alerte existe déjà, ne pas en créer une nouvelle
    if (existingAlert) {
      console.log('Alert already exists for this vehicle');
      return true;
    }

    // Créer le message d'alerte
    const vehicleDisplay = data.vehicleName || 'Véhicule';
    const baseMessage = `Le véhicule ${vehicleDisplay} a été mis en attente`;
    const fullMessage = data.reason 
      ? `${baseMessage} pour la raison suivante : ${data.reason}.`
      : `${baseMessage}. Vérifiez les causes du blocage.`;

    // Créer la nouvelle alerte
    const { error: insertError } = await supabase
      .from('system_alerts')
      .insert({
        company_id: data.companyId,
        entity_type: 'vehicle',
        vehicle_id: data.vehicleId,
        repair_order_id: data.repairOrderId,
        alert_type: 'vehicule_attente',
        title: 'Véhicule en attente',
        message: fullMessage,
        reason: data.reason || null
      });

    if (insertError) {
      console.error('Error creating vehicle alert:', insertError);
      return false;
    }

    console.log('✅ Alerte de véhicule en attente créée');
    return true;
  } catch (error) {
    console.error('Error in createVehicleWaitingAlert:', error);
    return false;
  }
};

export const resolveVehicleWaitingAlert = async (vehicleId: string, repairOrderId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('system_alerts')
      .update({ 
        resolved: true, 
        resolved_at: new Date().toISOString() 
      })
      .eq('entity_type', 'vehicle')
      .eq('vehicle_id', vehicleId)
      .eq('repair_order_id', repairOrderId)
      .eq('alert_type', 'vehicule_attente')
      .eq('resolved', false);

    if (error) {
      console.error('Error resolving vehicle alert:', error);
      return false;
    }

    console.log('✅ Alerte de véhicule résolue');
    return true;
  } catch (error) {
    console.error('Error in resolveVehicleWaitingAlert:', error);
    return false;
  }
};

// Fonction utilitaire pour détecter les changements de statut des repair_orders
export const checkRepairOrderStatusChange = async (repairOrderId: string, newStatus: string): Promise<void> => {
  try {
    // Récupérer les informations du repair_order
    const { data: repairOrder, error } = await supabase
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
      .single();

    if (error || !repairOrder) {
      console.error('Error fetching repair order:', error);
      return;
    }

    const isWaitingStatus = newStatus === 'En attente' || newStatus.toLowerCase().includes('attente');
    const isCompletedStatus = newStatus === 'Signé' || newStatus === 'Terminé';

    if (isWaitingStatus) {
      // Le véhicule passe en attente - créer une alerte
      const vehicle = repairOrder.vehicles;
      const vehicleName = vehicle 
        ? `${vehicle.car_brands?.name || 'Marque inconnue'} ${vehicle.car_models?.name || 'Modèle inconnu'} - ${vehicle.license_plate}`
        : 'Véhicule inconnu';

      await createVehicleWaitingAlert({
        companyId: repairOrder.company_id,
        vehicleId: repairOrder.vehicle_id,
        repairOrderId: repairOrder.id,
        vehicleName,
        reason: 'Changement de statut vers "En attente"'
      });
    } else if (isCompletedStatus) {
      // Le véhicule n'est plus en attente - résoudre l'alerte
      await resolveVehicleWaitingAlert(repairOrder.vehicle_id, repairOrder.id);
    }
  } catch (error) {
    console.error('Error in checkRepairOrderStatusChange:', error);
  }
};