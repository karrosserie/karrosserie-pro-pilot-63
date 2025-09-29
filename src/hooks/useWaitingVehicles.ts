import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WaitingVehicle {
  id: string;
  license_plate: string;
  color: string;
  created_at: string;
  car_brands?: { name: string } | null;
  car_models?: { name: string } | null;
  clients?: { 
    id: string;
    first_name: string; 
    last_name: string; 
  } | null;
  waiting_reason?: string;
  waiting_since?: string;
}

export const useWaitingVehicles = (companyId: string | null) => {
  const [waitingVehicles, setWaitingVehicles] = useState<WaitingVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    fetchWaitingVehicles();
  }, [companyId]);

  const fetchWaitingVehicles = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching waiting vehicles for company:', companyId);
      
      // Récupérer tous les véhicules avec leurs jointures (EXCLURE les véhicules terminés)
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select(`
          id,
          license_plate,
          color,
          created_at,
          status,
          car_brands:brand_id (name),
          car_models:model_id (name),
          clients:client_id (
            id,
            first_name,
            last_name
          )
        `)
        .eq('company_id', companyId)
        .neq('status', 'Terminé');

      if (vehiclesError) {
        console.error('❌ Error fetching vehicles:', vehiclesError);
        return;
      }

      console.log('🚗 Vehicles fetched:', vehicles?.length || 0, vehicles);

      // Récupérer les véhicules qui ont des tâches actives ou en attente normale (sans waiting_reason)
      const { data: activeSchedules, error: schedulesError } = await supabase
        .from('employee_schedule')
        .select('vehicle_id, status, waiting_reason')
        .eq('company_id', companyId)
        .in('status', ['En cours', 'En attente']);

      if (schedulesError) {
        console.error('❌ Error fetching active schedules:', schedulesError);
        return;
      }

      console.log('📅 Active schedules fetched:', activeSchedules?.length || 0, activeSchedules);

      // Approche simplifiée: récupérer directement tous les véhicules en attente avec leurs raisons
      console.log('🔍 Fetching vehicles with waiting reasons for company:', companyId);
      
      // 1. Récupérer tous les véhicules avec waiting_reason (EXCLURE les véhicules terminés)
      const { data: vehiclesWithReasons, error: reasonsError } = await supabase
        .from('employee_schedule')
        .select(`
          vehicle_id,
          waiting_reason,
          updated_at,
          vehicles!inner (
            id,
            license_plate,
            color,
            created_at,
            status,
            car_brands:brand_id (name),
            car_models:model_id (name),
            clients:client_id (
              id,
              first_name,
              last_name
            )
          )
        `)
        .eq('company_id', companyId)
        .not('waiting_reason', 'is', null)
        .eq('status', 'En attente')
        .neq('vehicles.status', 'Terminé');

      if (reasonsError) {
        console.error('❌ Error fetching vehicles with waiting reasons:', reasonsError);
      }

      console.log('🔍 Vehicles with waiting reasons:', vehiclesWithReasons?.length || 0, vehiclesWithReasons);

      // 2. Filtrer les véhicules qui ne sont pas dans un planning actif
      const activeVehicleIds = new Set(
        activeSchedules?.filter(s => !s.waiting_reason).map(s => s.vehicle_id) || []
      );
      const regularWaitingVehicles = vehicles?.filter(vehicle => 
        !activeVehicleIds.has(vehicle.id)
      ) || [];

      console.log('🚗 Regular waiting vehicles (no active schedules):', regularWaitingVehicles.length, regularWaitingVehicles);

      // 3. Construire la liste complète
      const allWaitingVehicles: WaitingVehicle[] = [];
      
      // Ajouter les véhicules avec waiting_reason en priorité
      if (vehiclesWithReasons) {
        for (const scheduleWithVehicle of vehiclesWithReasons) {
          allWaitingVehicles.push({
            id: scheduleWithVehicle.vehicles.id,
            license_plate: scheduleWithVehicle.vehicles.license_plate,
            color: scheduleWithVehicle.vehicles.color,
            created_at: scheduleWithVehicle.vehicles.created_at,
            car_brands: scheduleWithVehicle.vehicles.car_brands,
            car_models: scheduleWithVehicle.vehicles.car_models,
            clients: scheduleWithVehicle.vehicles.clients,
            waiting_reason: scheduleWithVehicle.waiting_reason,
            waiting_since: scheduleWithVehicle.updated_at
          });
        }
      }
      
      // Ajouter les véhicules en attente normale (pas de waiting_reason)
      const vehiclesWithReasonsIds = new Set(vehiclesWithReasons?.map(v => v.vehicles.id) || []);
      for (const vehicle of regularWaitingVehicles) {
        if (!vehiclesWithReasonsIds.has(vehicle.id)) {
          allWaitingVehicles.push({
            ...vehicle,
            waiting_reason: undefined,
            waiting_since: vehicle.created_at
          });
        }
      }

      console.log('✅ Waiting vehicles loaded:', {
        totalVehicles: vehicles?.length || 0,
        activeVehicles: activeVehicleIds.size,
        waitingVehicles: regularWaitingVehicles.length,
        vehiclesWithReasons: vehiclesWithReasons?.length || 0,
        totalWaitingVehicles: allWaitingVehicles.length,
        allWaitingVehicles: allWaitingVehicles.map(v => ({
          id: v.id,
          license_plate: v.license_plate,
          waiting_reason: v.waiting_reason
        }))
      });

      setWaitingVehicles(allWaitingVehicles);

    } catch (error) {
      console.error('❌ Unexpected error fetching waiting vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    waitingVehicles,
    loading,
    refetch: fetchWaitingVehicles
  };
};