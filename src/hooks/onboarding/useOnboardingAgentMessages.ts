import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    refetchInterval: 30000, // Polling toutes les 30 secondes
  });

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
