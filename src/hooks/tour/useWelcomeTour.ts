import { useState, useEffect } from 'react';
import { welcomeTourService } from '@/services/welcomeTour/WelcomeTourService';
import { WelcomeTourState } from '@/types/welcomeTour';

export function useWelcomeTour() {
  const [state, setState] = useState<WelcomeTourState>(() => 
    welcomeTourService.getTourState()
  );

  useEffect(() => {
    // Écouter les changements du tour
    const handleTourUpdate = (event: CustomEvent<WelcomeTourState>) => {
      setState(event.detail);
    };

    window.addEventListener('welcome-tour-updated', handleTourUpdate as EventListener);

    return () => {
      window.removeEventListener('welcome-tour-updated', handleTourUpdate as EventListener);
    };
  }, []);

  return {
    state,
    hasSeenWelcome: state.hasSeenWelcome,
    completedFeatures: state.completedFeatures,
    markWelcomeAsSeen: () => welcomeTourService.markWelcomeAsSeen(),
    markFeatureCompleted: (featureId: string) => welcomeTourService.markFeatureCompleted(featureId),
    setCurrentFeature: (featureId: string, stepIndex?: number) => 
      welcomeTourService.setCurrentFeature(featureId, stepIndex),
    resetTour: () => welcomeTourService.resetTour()
  };
}
