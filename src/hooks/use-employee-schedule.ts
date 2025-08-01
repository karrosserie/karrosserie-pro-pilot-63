import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';

export interface EmployeeSchedule {
  id: string;
  company_id: string;
  employee_id: string;
  vehicle_id: string | null;
  task_type: string;
  start_datetime: string;
  end_datetime: string;
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

export const useEmployeeSchedule = (employeeId?: string) => {
  const { companyInfo } = useCompany();

  const {
    data: schedules = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['employee-schedule', companyInfo?.id, employeeId],
    queryFn: async () => {
      if (!companyInfo?.id || !employeeId) return [];

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
          .eq('employee_id', employeeId)
          .order('start_datetime', { ascending: true });

        if (error) throw error;
        return (data || []) as EmployeeSchedule[];
      } catch (error) {
        console.error('Error fetching employee schedule:', error);
        return [];
      }
    },
    enabled: !!companyInfo?.id && !!employeeId
  });

  return {
    schedules,
    isLoading,
    error,
    refetch
  };
};