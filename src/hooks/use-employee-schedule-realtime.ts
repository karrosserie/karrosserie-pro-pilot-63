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

  // Setup realtime subscription
  useEffect(() => {
    if (!companyInfo?.id || !userId) return;

    let channel: any;

    const setupRealtime = async () => {
      try {
        channel = supabase
          .channel(`employee-schedule-${userId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'employee_schedule',
              filter: `company_id=eq.${companyInfo.id}`
            },
            (payload) => {
              console.log('📡 Employee schedule realtime update:', payload);
              
              // Invalidate and refetch the query
              queryClient.invalidateQueries({
                queryKey: ['employee-schedule-realtime', companyInfo.id, userId]
              });

              // Show toast for instruction updates
              if (payload.eventType === 'UPDATE' && 
                  payload.new?.detailed_instructions && 
                  payload.new.detailed_instructions !== payload.old?.detailed_instructions) {
                toast({
                  title: "Instructions IA mises à jour",
                  description: "Les instructions détaillées ont été reçues de N8N",
                });
              }
            }
          )
          .subscribe((status) => {
            console.log('📡 Realtime subscription status:', status);
            if (status === 'SUBSCRIBED') {
              setRealtimeError(null);
            } else if (status === 'CHANNEL_ERROR') {
              setRealtimeError('Erreur de connexion temps réel');
            }
          });

      } catch (error) {
        console.error('❌ Error setting up realtime subscription:', error);
        setRealtimeError('Impossible d\'établir la connexion temps réel');
      }
    };

    setupRealtime();

    return () => {
      if (channel) {
        console.log('🔌 Cleaning up realtime subscription');
        supabase.removeChannel(channel);
      }
    };
  }, [companyInfo?.id, userId, queryClient]);

  return {
    schedules,
    isLoading,
    error,
    realtimeError,
    refetch
  };
};