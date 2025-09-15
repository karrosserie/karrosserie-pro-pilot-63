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
      
      // Récupérer tous les véhicules avec leurs jointures
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select(`
          id,
          license_plate,
          color,
          created_at,
          car_brands:brand_id (name),
          car_models:model_id (name),
          clients:client_id (
            id,
            first_name,
            last_name
          )
        `)
        .eq('company_id', companyId);

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

      // Récupérer les véhicules avec des tâches en attente avec raison
      console.log('🔍 Fetching waiting reason schedules for company:', companyId);
        const { data: waitingReasonSchedules, error: waitingError } = await supabase
        .from('employee_schedule')
        .select(`
          vehicle_id,
          waiting_reason,
          updated_at,
          vehicles!left (
            id,
            license_plate,
            color,
            created_at,
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
        .not('waiting_reason', 'is', null);

      console.log('🔍 Raw waiting reason schedules response:', { 
        data: waitingReasonSchedules, 
        error: waitingError 
      });

      if (waitingError) {
        console.error('❌ Error fetching waiting reason schedules:', waitingError);
        return;
      }

      console.log('⏳ Waiting reason schedules fetched:', waitingReasonSchedules?.length || 0, waitingReasonSchedules);

      // Filtrer les véhicules qui ne sont pas dans un planning actif (sans waiting_reason)
      const activeVehicleIds = new Set(
        activeSchedules?.filter(s => !s.waiting_reason).map(s => s.vehicle_id) || []
      );
      const waitingVehiclesList = vehicles?.filter(vehicle => 
        !activeVehicleIds.has(vehicle.id)
      ) || [];

      console.log('🚗 Regular waiting vehicles (no active schedules):', waitingVehiclesList.length, waitingVehiclesList);

      // Ajouter les véhicules avec waiting_reason à la liste
      const waitingReasonVehicles = waitingReasonSchedules?.map(schedule => ({
        id: schedule.vehicles.id,
        license_plate: schedule.vehicles.license_plate,
        color: schedule.vehicles.color,
        created_at: schedule.vehicles.created_at,
        car_brands: schedule.vehicles.car_brands,
        car_models: schedule.vehicles.car_models,
        clients: schedule.vehicles.clients,
        waiting_reason: schedule.waiting_reason,
        waiting_since: schedule.updated_at
      })) || [];

      // Traiter les véhicules normaux en attente (sans waiting_reason spécifique)
      const regularWaitingVehicles = waitingVehiclesList.map(vehicle => ({
        ...vehicle,
        waiting_reason: undefined, // Pas de raison spécifique
        waiting_since: vehicle.created_at // Utiliser la date de création comme référence
      }));

      console.log('⏳ Vehicles with waiting reasons:', waitingReasonVehicles.length, waitingReasonVehicles);

      // Combiner les deux listes en évitant les doublons
      const allWaitingVehicles: WaitingVehicle[] = [
        ...regularWaitingVehicles,
        ...waitingReasonVehicles.filter(wrv => 
          !regularWaitingVehicles.some(wv => wv.id === wrv.id)
        )
      ];

      console.log('✅ Waiting vehicles loaded:', {
        totalVehicles: vehicles?.length || 0,
        activeVehicles: activeVehicleIds.size,
        waitingVehicles: regularWaitingVehicles.length,
        waitingReasonVehicles: waitingReasonVehicles.length,
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