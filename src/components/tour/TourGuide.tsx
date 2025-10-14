import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useWelcomeTour } from '@/hooks/tour/useWelcomeTour';
import { WELCOME_FEATURES } from '@/config/welcomeFeatures';

export function TourGuide() {
  const { state, markFeatureCompleted, setCurrentFeature } = useWelcomeTour();
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    if (state.currentFeatureId) {
      const feature = WELCOME_FEATURES.find(f => f.id === state.currentFeatureId);
      
      if (feature) {
        // Convertir les TourStep en Step de react-joyride
        const joyrideSteps: Step[] = feature.tourSteps.map(step => ({
          target: step.target,
          title: step.title,
          content: step.content,
          placement: step.placement || 'auto',
          disableBeacon: true
        }));

        setSteps(joyrideSteps);
        
        // Petit délai pour s'assurer que la page est chargée
        setTimeout(() => setRun(true), 500);
      }
    }
  }, [state.currentFeatureId]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      // Tour terminé ou sauté
      setRun(false);
      
      if (state.currentFeatureId) {
        // Marquer comme complété
        markFeatureCompleted(state.currentFeatureId);
        
        // Réinitialiser l'état
        setCurrentFeature('', 0);
      }
    }
  };

  if (!run || steps.length === 0) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      stepIndex={state.currentStepIndex}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: 'hsl(var(--primary))',
          zIndex: 10000,
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
        },
        buttonBack: {
          color: 'hsl(var(--primary))',
        },
      }}
      locale={{
        back: 'Retour',
        close: 'Fermer',
        last: 'Terminer',
        next: 'Suivant',
        skip: 'Passer',
      }}
    />
  );
}
