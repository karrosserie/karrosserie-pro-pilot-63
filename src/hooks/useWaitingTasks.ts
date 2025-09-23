import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { EmployeeSchedule } from './use-employee-schedule';

export const useWaitingTasks = () => {
  const { companyInfo } = useCompany();

  const {
    data: waitingTasks = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['waiting-tasks', companyInfo?.id],
    queryFn: async () => {
      if (!companyInfo?.id) return [];

      try {
        const { data, error } = await supabase
          .from('employee_schedule')
          .select(`
            *,
            profiles!user_id (
              id,
              first_name,
              last_name
            ),
            vehicles (
              license_plate,
              car_brands (name),
              car_models (name),
              clients (first_name, last_name)
            )
          `)
          .eq('company_id', companyInfo.id)
          .eq('status', 'En attente') // Récupérer les tâches en attente
          .order('updated_at', { ascending: false });

        if (error) throw error;
        return (data || []) as any[];
      } catch (error) {
        console.error('Error fetching waiting tasks:', error);
        return [];
      }
    },
    enabled: !!companyInfo?.id
  });

  const resumeTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('employee_schedule')
        .update({ 
          status: 'En cours'
        })
        .eq('id', taskId);

      if (error) throw error;
      refetch();
      return { success: true };
    } catch (error) {
      console.error('Error resuming task:', error);
      return { success: false, error };
    }
  };

  return {
    waitingTasks,
    isLoading,
    error,
    refetch,
    resumeTask
  };
};