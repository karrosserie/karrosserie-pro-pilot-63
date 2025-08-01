import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';

export interface WorkshopSchedule {
  id: string;
  company_id: string;
  day_of_week: string;
  morning_start: string | null;
  morning_end: string | null;
  afternoon_start: string | null;
  afternoon_end: string | null;
  full_day: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useWorkshopSchedule = () => {
  const { companyInfo } = useCompany();

  const {
    data: schedules = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['workshop-schedule', companyInfo?.id],
    queryFn: async () => {
      if (!companyInfo?.id) return [];

      try {
        const { data, error } = await supabase
          .from('workshop_schedule')
          .select('*')
          .eq('company_id', companyInfo.id)
          .order('day_of_week', { ascending: true });

        if (error) throw error;
        return (data || []) as WorkshopSchedule[];
      } catch (error) {
        console.error('Error fetching workshop schedule:', error);
        return [];
      }
    },
    enabled: !!companyInfo?.id
  });

  return {
    schedules,
    isLoading,
    error,
    refetch
  };
};