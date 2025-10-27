import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';

export interface VehicleWorkTime {
  vehicle_id: string;
  total_work_minutes: number;
  current_total_minutes: number;
  formatted_duration: string;
  is_currently_working: boolean;
  last_task_start: string | null;
  license_plate: string;
}

export const useVehicleWorkTime = (vehicleId?: string) => {
  const { companyInfo } = useCompany();

  return useQuery({
    queryKey: ['vehicle-work-time', companyInfo?.id, vehicleId],
    queryFn: async () => {
      if (!companyInfo?.id) return null;

      let query = (supabase as any)
        .from('vehicle_work_time_summary')
        .select('*')
        .eq('company_id', companyInfo.id);

      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
        const { data, error } = await query.single();
        if (error) {
          // Si aucun enregistrement n'existe encore, retourner des valeurs par défaut
          if (error.code === 'PGRST116') {
            return {
              vehicle_id: vehicleId,
              total_work_minutes: 0,
              current_total_minutes: 0,
              formatted_duration: '0h 0min',
              is_currently_working: false,
              last_task_start: null,
              license_plate: ''
            } as VehicleWorkTime;
          }
          throw error;
        }
        return data as VehicleWorkTime;
      } else {
        const { data, error } = await query;
        if (error) throw error;
        return data as VehicleWorkTime[];
      }
    },
    enabled: !!companyInfo?.id,
    refetchInterval: (query) => {
      // Rafraîchir toutes les 5 secondes si un véhicule est en cours de travail
      if (vehicleId && query.state.data && (query.state.data as VehicleWorkTime).is_currently_working) {
        return 5000;
      }
      // Sinon, toutes les 30 secondes
      return 30000;
    }
  });
};

// Hook pour récupérer tous les temps de travail
export const useAllVehiclesWorkTime = () => {
  const { companyInfo } = useCompany();

  return useQuery({
    queryKey: ['all-vehicles-work-time', companyInfo?.id],
    queryFn: async () => {
      if (!companyInfo?.id) return [];

      const { data, error } = await (supabase as any)
        .from('vehicle_work_time_summary')
        .select('*')
        .eq('company_id', companyInfo.id)
        .order('current_total_minutes', { ascending: false });

      if (error) throw error;
      return data as VehicleWorkTime[];
    },
    enabled: !!companyInfo?.id,
    refetchInterval: 30000 // Rafraîchir toutes les 30 secondes
  });
};
