import { useState, useEffect, useRef } from 'react';
import { Step, CallBackProps, STATUS } from 'react-joyride';

export const useLoanFormGuide = (
  isViewMode: boolean, 
  isOpen: boolean,
  driverLicenseFrontUrl?: string,
  driverLicenseBackUrl?: string
) => {
  const [runTour, setRunTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInteractingRef = useRef(false);
  const previousLicenseRef = useRef({ front: '', back: '' });

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

  // Nettoyer le timer à la destruction du composant
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  // Réinitialiser le timer d'inactivité
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Après 2 secondes sans activité, réafficher le guide à l'étape suivante
    inactivityTimerRef.current = setTimeout(() => {
      if (isInteractingRef.current) {
        isInteractingRef.current = false;
        setCurrentStep(prev => Math.min(prev + 1, 7));
        setRunTour(true);
      }
    }, 2000);
  };

  // Détecter quand le permis de conduire est uploadé
  useEffect(() => {
    console.log('License Upload Detection - Step:', currentStep, 'Front:', driverLicenseFrontUrl, 'Back:', driverLicenseBackUrl);
    
    if (!isOpen || isViewMode) {
      console.log('License Upload Detection - Skipped (dialog closed or view mode)');
      return;
    }

    // Détecter l'upload uniquement si on est aux premières étapes (0, 1 ou 2)
    if (currentStep > 2) {
      console.log('License Upload Detection - Already past license step');
      return;
    }

    const hasNewFrontUrl = driverLicenseFrontUrl && driverLicenseFrontUrl !== previousLicenseRef.current.front;
    const hasNewBackUrl = driverLicenseBackUrl && driverLicenseBackUrl !== previousLicenseRef.current.back;

    console.log('License Upload Detection - Has new front?', hasNewFrontUrl, 'Has new back?', hasNewBackUrl);

    if (hasNewFrontUrl || hasNewBackUrl) {
      console.log('License Upload Detection - New license detected! Advancing to next step...');
      
      // Mise à jour des références
      previousLicenseRef.current = {
        front: driverLicenseFrontUrl || '',
        back: driverLicenseBackUrl || ''
      };

      // Si au moins un côté du permis est uploadé, passer à l'étape suivante
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      isInteractingRef.current = false;
      
      // Attendre un peu puis passer à l'étape suivante
      setTimeout(() => {
        console.log('License Upload Detection - Setting step to 2 and showing tour');
        setCurrentStep(2);
        setRunTour(true);
      }, 1500);
    }
  }, [driverLicenseFrontUrl, driverLicenseBackUrl, currentStep, isOpen, isViewMode]);

  // Détecter les interactions avec les champs du formulaire
  useEffect(() => {
    if (!isOpen || isViewMode) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tourElement = target.closest('[data-tour]');
      
      if (tourElement) {
        const isFormElement = target.matches('input, select, button, textarea, [role="combobox"]') ||
                             target.closest('input, select, button, textarea, [role="combobox"]');
        
        if (isFormElement && runTour) {
          // Masquer le guide et démarrer le timer d'inactivité
          isInteractingRef.current = true;
          setRunTour(false);
          resetInactivityTimer();
        }
      }
    };

    const handleInput = () => {
      // Réinitialiser le timer à chaque modification
      if (isInteractingRef.current) {
        resetInactivityTimer();
      }
    };

    const handleChange = () => {
      // Réinitialiser le timer à chaque changement
      if (isInteractingRef.current) {
        resetInactivityTimer();
      }
    };

    document.addEventListener('mousedown', handleClick, true);
    document.addEventListener('input', handleInput, true);
    document.addEventListener('change', handleChange, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClick, true);
      document.removeEventListener('input', handleInput, true);
      document.removeEventListener('change', handleChange, true);
    };
  }, [isOpen, isViewMode, runTour]);

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
