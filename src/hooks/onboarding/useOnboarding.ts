import { useState, useEffect } from 'react';
import { onboardingService } from '@/services/onboarding/OnboardingService';
import { OnboardingState, TunnelKey, StepKey, TunnelProgress } from '@/types/onboarding';

/**
 * Hook personnalisé pour accéder à l'état d'onboarding
 * Se met à jour automatiquement quand l'état change
 */
export function useOnboarding() {
  const [state, setState] = useState<OnboardingState | null>(() => 
    onboardingService.getOnboardingState()
  );

  useEffect(() => {
    // Écouter les changements de l'état d'onboarding
    const handleOnboardingUpdate = (event: CustomEvent<OnboardingState>) => {
      setState(event.detail);
    };

    window.addEventListener('onboarding-updated', handleOnboardingUpdate as EventListener);

    // Écouter aussi les changements dans localStorage (si changement depuis un autre onglet)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'onboarding_state') {
        setState(onboardingService.getOnboardingState());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('onboarding-updated', handleOnboardingUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getTunnelProgress = (tunnel: TunnelKey): TunnelProgress => {
    return onboardingService.getTunnelProgress(tunnel);
  };

  const getOverallProgress = (): TunnelProgress => {
    return onboardingService.getOverallProgress();
  };

  const isStepCompleted = (tunnel: TunnelKey, step: StepKey): boolean => {
    return onboardingService.isStepCompleted(tunnel, step);
  };

  const updateStep = (tunnel: TunnelKey, step: StepKey, data: Partial<any>): void => {
    onboardingService.updateOnboardingStep(tunnel, step, data);
  };

  return {
    state,
    getTunnelProgress,
    getOverallProgress,
    isStepCompleted,
    updateStep,
  };
}
