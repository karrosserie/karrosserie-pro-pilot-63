import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userOnboardingProgressService, OnboardingHelpType } from '@/services/user-onboarding/userOnboardingProgressService';

export function useUserOnboardingProgress() {
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['user-onboarding-progress'],
    queryFn: () => userOnboardingProgressService.getUserProgress(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const markHelpAsSeenMutation = useMutation({
    mutationFn: (helpType: OnboardingHelpType) => 
      userOnboardingProgressService.markHelpAsSeen(helpType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-onboarding-progress'] });
    },
  });

  const resetAllHelpMutation = useMutation({
    mutationFn: () => userOnboardingProgressService.resetAllHelp(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-onboarding-progress'] });
    },
  });

  return {
    progress,
    isLoading,
    markHelpAsSeen: markHelpAsSeenMutation.mutate,
    resetAllHelp: resetAllHelpMutation.mutate,
    shouldShowQuoteConvertHelp: !progress?.quote_convert_help_seen,
    shouldShowRepairOrderHelp: !progress?.repair_order_help_seen,
    shouldShowCessionHelp: !progress?.cession_help_seen,
    shouldShowFleetReservationHelp: !progress?.fleet_reservation_help_seen,
    shouldShowFleetGuide: !progress?.fleet_reservation_guide_completed,
    shouldShowExpertiseReportPrompt: !progress?.expertise_report_prompt_seen,
  };
}
