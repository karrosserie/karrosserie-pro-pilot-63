import { useState, useEffect } from 'react';
import { Step, CallBackProps, STATUS } from 'react-joyride';

export const useLoanFormGuide = (isViewMode: boolean, isOpen: boolean) => {
  const [runTour, setRunTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isViewMode && isOpen) {
      setTimeout(() => {
        const firstElement = document.querySelector('[data-tour="client-select"]');
        if (firstElement) {
          setCurrentStep(0);
          setRunTour(true);
        } else {
          setTimeout(() => {
            setCurrentStep(0);
            setRunTour(true);
          }, 500);
        }
      }, 1000);
    } else {
      setRunTour(false);
      setCurrentStep(0);
    }
  }, [isViewMode, isOpen]);

  // Gérer les interactions avec les champs
  useEffect(() => {
    if (!runTour) return;

    const tourElements = document.querySelectorAll('[data-tour]');
    
    const handleFocus = () => {
      // Masquer le guide quand on clique sur un champ
      setRunTour(false);
    };

    const handleBlur = () => {
      // Réafficher le guide à l'étape suivante après avoir quitté le champ
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setRunTour(true);
      }, 500);
    };

    tourElements.forEach(element => {
      element.addEventListener('focus', handleFocus, true);
      element.addEventListener('blur', handleBlur, true);
    });

    return () => {
      tourElements.forEach(element => {
        element.removeEventListener('focus', handleFocus, true);
        element.removeEventListener('blur', handleBlur, true);
      });
    };
  }, [runTour, currentStep]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      setCurrentStep(0);
    } else if (type === 'step:after') {
      if (action === 'next') {
        setCurrentStep(index + 1);
      } else if (action === 'prev') {
        setCurrentStep(index - 1);
      }
    }
  };

  const steps: Step[] = [
    {
      target: '[data-tour="client-select"]',
      content: 'Commencez par sélectionner le client qui va emprunter le véhicule. Vous pouvez chercher un client existant ou en créer un nouveau.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="driver-license"]',
      content: 'Téléchargez le permis de conduire du client (recto et verso). L\'analyse automatique remplira les informations nécessaires.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="insurance-switch"]',
      content: 'Indiquez si le client possède une assurance. Si oui, renseignez les informations de l\'assurance.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="damage-assessment"]',
      content: 'Inspectez le véhicule et signalez tous les chocs et rayures existants avant le prêt.',
      placement: 'top',
    },
    {
      target: '[data-tour="vehicle-mileage"]',
      content: 'Renseignez le kilométrage actuel du véhicule au moment du prêt.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="fuel-level"]',
      content: 'Indiquez le niveau de carburant du véhicule (en pourcentage).',
      placement: 'bottom',
    },
    {
      target: '[data-tour="vehicle-photos"]',
      content: 'Prenez des photos du véhicule avant le prêt. Cela servira de preuve de l\'état initial.',
      placement: 'top',
    },
    {
      target: '[data-tour="attestation"]',
      content: 'Enfin, faites lire et signer l\'attestation de prêt au client.',
      placement: 'top',
    },
  ];

  return {
    runTour,
    stepIndex: currentStep,
    steps,
    handleJoyrideCallback,
  };
};
