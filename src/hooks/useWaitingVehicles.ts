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

      // Récupérer les véhicules qui ont des tâches actives
      const { data: activeSchedules, error: schedulesError } = await supabase
        .from('employee_schedule')
        .select('vehicle_id, status')
        .eq('company_id', companyId)
        .in('status', ['En cours', 'En attente']);

      if (schedulesError) {
        console.error('❌ Error fetching active schedules:', schedulesError);
        return;
      }

      // Filtrer les véhicules qui ne sont pas dans un planning actif
      const activeVehicleIds = new Set(activeSchedules?.map(s => s.vehicle_id) || []);
      const waitingVehiclesList = vehicles?.filter(vehicle => 
        !activeVehicleIds.has(vehicle.id)
      ) || [];

      console.log('✅ Waiting vehicles loaded:', {
        totalVehicles: vehicles?.length || 0,
        activeVehicles: activeVehicleIds.size,
        waitingVehicles: waitingVehiclesList.length,
        waitingVehiclesList
      });

      setWaitingVehicles(waitingVehiclesList);

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