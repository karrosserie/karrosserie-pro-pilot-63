import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';

export interface EmployeeSchedule {
  id: string;
  company_id: string;
  user_id: string;
  vehicle_id: string | null;
  task_type: string;
  start_datetime: string;
  end_datetime: string;
  status: 'En attente' | 'En cours' | 'Terminé';
  real_start_datetime: string | null;
  real_end_datetime: string | null;
  paint_brand?: string | null;
  color_code?: string | null;
  created_at: string;
  updated_at: string;
  vehicles?: {
    license_plate: string;
    car_brands?: { name: string } | null;
    car_models?: { name: string } | null;
    clients?: {
      first_name: string;
      last_name: string;
    } | null;
  } | null;
}

export const useEmployeeSchedule = (userId?: string) => {
  const { companyInfo } = useCompany();

  const {
    data: schedules = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['employee-schedule', companyInfo?.id, userId],
    queryFn: async () => {
      if (!companyInfo?.id || !userId) return [];

      try {
        const { data, error } = await (supabase as any)
          .from('employee_schedule')
          .select(`
            *,
            vehicles (
              license_plate,
              car_brands (name),
              car_models (name),
              clients (first_name, last_name)
            )
          `)
          .eq('company_id', companyInfo.id)
          .eq('user_id', userId)
          .neq('status', 'Terminé')  // Exclure les tâches terminées
          .is('waiting_reason', null) // Filtrer les tâches en attente avec raison
          .order('start_datetime', { ascending: true });

        if (error) throw error;
        return (data || []) as EmployeeSchedule[];
      } catch (error) {
        console.error('Error fetching employee schedule:', error);
        return [];
      }
    },
    enabled: !!companyInfo?.id && !!userId
  });

  return {
    schedules,
    isLoading,
    error,
    refetch
  };
};