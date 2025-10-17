import { useState, useEffect, useRef } from 'react';
import { Step, CallBackProps, STATUS } from 'react-joyride';

export const useLoanFormGuide = (isViewMode: boolean, isOpen: boolean) => {
  const [runTour, setRunTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const isInteractingRef = useRef(false);

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

  // Détecter les interactions avec les champs du formulaire
  useEffect(() => {
    if (!isOpen || isViewMode) return;

    const handleInteractionStart = (e: MouseEvent) => {
      // Vérifier si on clique sur un élément de formulaire à l'intérieur d'une zone data-tour
      const target = e.target as HTMLElement;
      const tourElement = target.closest('[data-tour]');
      
      if (tourElement && !isInteractingRef.current) {
        const isFormElement = target.matches('input, select, button, textarea, [role="combobox"]') ||
                             target.closest('input, select, button, textarea, [role="combobox"]');
        
        if (isFormElement) {
          isInteractingRef.current = true;
          setRunTour(false);
        }
      }
    };

    const handleInteractionEnd = () => {
      if (isInteractingRef.current) {
        isInteractingRef.current = false;
        // Attendre un peu avant de réafficher le guide à l'étape suivante
        setTimeout(() => {
          setCurrentStep(prev => Math.min(prev + 1, 7)); // Maximum 7 étapes (0-7)
          setRunTour(true);
        }, 800);
      }
    };

    document.addEventListener('mousedown', handleInteractionStart, true);
    document.addEventListener('change', handleInteractionEnd, true);
    
    return () => {
      document.removeEventListener('mousedown', handleInteractionStart, true);
      document.removeEventListener('change', handleInteractionEnd, true);
    };
  }, [isOpen, isViewMode]);

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
        setCurrentStep(Math.max(0, index - 1));
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
