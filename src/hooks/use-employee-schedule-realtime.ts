import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { toast } from '@/hooks/use-toast';
import { EmployeeSchedule } from './use-employee-schedule';

export const useEmployeeScheduleRealtime = (userId?: string) => {
  const { companyInfo } = useCompany();
  const queryClient = useQueryClient();
  const [realtimeError, setRealtimeError] = useState<string | null>(null);

  const {
    data: schedules = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['employee-schedule-realtime', companyInfo?.id, userId],
    queryFn: async () => {
      if (!companyInfo?.id || !userId) return [];

      try {
        const { data, error } = await supabase
          .from('employee_schedule')
          .select(`
            *,
            detailed_instructions,
            vehicles (
              license_plate,
              car_brands (name),
              car_models (name),
              clients (first_name, last_name)
            )
          `)
          .eq('company_id', companyInfo.id)
          .eq('user_id', userId)
          .neq('status', 'Terminé')
          .order('start_datetime', { ascending: true });

        if (error) throw error;
        return (data || []) as any[];
      } catch (error) {
        console.error('Error fetching employee schedule:', error);
        return [];
      }
    },
    enabled: !!companyInfo?.id && !!userId
  });

  // Setup realtime subscription - TEMPORARILY DISABLED to fix WebSocket issues
  // TODO: Re-enable once WebSocket compatibility is resolved
  useEffect(() => {
    console.log('🔌 Realtime subscription temporarily disabled due to WebSocket issues');
    // Realtime code will be re-enabled once WebSocket is properly configured
    
    // if (!companyInfo?.id || !userId) return;
    // let channel: any;
    // ... rest of realtime code commented out
  }, [companyInfo?.id, userId, queryClient]);

  return {
    schedules,
    isLoading,
    error,
    realtimeError,
    refetch
  };
};