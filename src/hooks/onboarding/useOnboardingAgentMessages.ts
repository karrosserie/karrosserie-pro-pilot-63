import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { onboardingService } from '@/services/onboarding/OnboardingService';

interface OnboardingAgentMessage {
  id: number;
  session_id: string;
  message: {
    type: string;
    content: string;
    tool_calls: any[];
    additional_kwargs: Record<string, any>;
    response_metadata: Record<string, any>;
    invalid_tool_calls: any[];
  };
  created_at: string;
  read: boolean;
}

export function useOnboardingAgentMessages() {
  const queryClient = useQueryClient();

  // Récupérer l'ID d'onboarding depuis le localStorage
  const onboardingState = onboardingService.getOnboardingState();
  const onboardingId = onboardingState?.id;

  // Query pour récupérer le message le plus récent non lu
  const { data: unreadMessage, isLoading } = useQuery({
    queryKey: ['onboarding-agent-messages', onboardingId],
    queryFn: async () => {
      if (!onboardingId) return null;

      const { data, error } = await supabase
        .from('ai_messages_history')
        .select('*')
        .eq('session_id', onboardingId)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching onboarding message:', error);
        return null;
      }

      // Vérifier que le message est de type "ai"
      if (data && typeof data.message === 'object' && data.message !== null) {
        const msg = data.message as any;
        if (msg.type === 'ai') {
          return data as OnboardingAgentMessage;
        }
      }

      return null;
    },
    enabled: !!onboardingId,
  });

  // Setup Realtime subscription pour les nouveaux messages
  useEffect(() => {
    if (!onboardingId) return;

    console.log('🔌 [Realtime] Setting up subscription for session:', onboardingId);
    
    const channel = supabase
      .channel('onboarding-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_messages_history',
          filter: `session_id=eq.${onboardingId}`
        },
        (payload) => {
          console.log('📨 [Realtime] New message received:', payload);
          
          const newMessage = payload.new as any;
          if (newMessage.message?.type === 'ai' && !newMessage.read) {
            console.log('✅ [Realtime] Valid AI message detected, invalidating query...');
            queryClient.invalidateQueries({ 
              queryKey: ['onboarding-agent-messages', onboardingId] 
            });
          } else {
            console.log('⚠️ [Realtime] Message skipped (not AI or already read)');
          }
        }
      )
      .subscribe((status) => {
        console.log('🔌 [Realtime] Subscription status:', status);
      });

    return () => {
      console.log('🔌 [Realtime] Cleaning up subscription...');
      supabase.removeChannel(channel);
    };
  }, [onboardingId, queryClient]);

  // Mutation pour marquer le message comme lu
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const { error } = await supabase
        .from('ai_messages_history')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalider la query pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['onboarding-agent-messages', onboardingId] });
    },
  });

  return {
    unreadMessage,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
  };
}
