import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';

export interface EmployeeWorkTime {
  user_id: string;
  date: string;
  total_work_minutes: number;
  current_total_minutes: number;
  formatted_duration: string;
  is_currently_working: boolean;
  current_task_id: string | null;
  current_task_start: string | null;
  employee_name: string;
  current_task_type: string | null;
  current_vehicle_id: string | null;
  current_vehicle_plate: string | null;
}

export const useEmployeeWorkTime = (userId?: string, date?: string) => {
  const { companyInfo } = useCompany();
  const targetDate = date || new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['employee-work-time', companyInfo?.id, userId, targetDate],
    queryFn: async () => {
      if (!companyInfo?.id) return null;

      let query = supabase
        .from('employee_work_time_summary')
        .select('*')
        .eq('company_id', companyInfo.id)
        .eq('date', targetDate);

      if (userId) {
        query = query.eq('user_id', userId);
        const { data, error } = await query.single();
        if (error) {
          // If no record exists yet, return default values
          if (error.code === 'PGRST116') {
            return {
              user_id: userId,
              date: targetDate,
              total_work_minutes: 0,
              current_total_minutes: 0,
              formatted_duration: '0h 0min',
              is_currently_working: false,
              current_task_id: null,
              current_task_start: null,
              employee_name: '',
              current_task_type: null,
              current_vehicle_id: null,
              current_vehicle_plate: null
            } as EmployeeWorkTime;
          }
          throw error;
        }
        return data as EmployeeWorkTime;
      } else {
        const { data, error } = await query;
        if (error) throw error;
        return data as EmployeeWorkTime[];
      }
    },
    enabled: !!companyInfo?.id,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Refresh every 5 seconds if employee is working
      if (userId && data && (data as EmployeeWorkTime).is_currently_working) {
        return 5000;
      }
      // Otherwise, every 30 seconds
      return 30000;
    }
  });
};

// Hook to fetch all work times for the day
export const useAllEmployeesWorkTime = (date?: string) => {
  const { companyInfo } = useCompany();
  const targetDate = date || new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['all-employees-work-time', companyInfo?.id, targetDate],
    queryFn: async () => {
      if (!companyInfo?.id) return [];

      const { data, error } = await supabase
        .from('employee_work_time_summary')
        .select('*')
        .eq('company_id', companyInfo.id)
        .eq('date', targetDate)
        .order('current_total_minutes', { ascending: false });

      if (error) throw error;
      return data as EmployeeWorkTime[];
    },
    enabled: !!companyInfo?.id,
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};

