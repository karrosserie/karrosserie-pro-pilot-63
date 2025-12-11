import { useState, useEffect, useRef } from 'react';
import { Step, CallBackProps, STATUS, ACTIONS, LIFECYCLE } from 'react-joyride';

export const useLoanFormGuide = (
  isViewMode: boolean, 
  isOpen: boolean,
  driverLicenseFrontUrl?: string,
  driverLicenseBackUrl?: string,
  setActiveTab?: (tab: string) => void,
  activeTab?: string
) => {
  const [runTour, setRunTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousLicenseRef = useRef({ front: '', back: '' });

  // Mapping direct : 1 étape = 1 onglet
  const tabToStep: { [key: string]: number } = {
    'client-info': 0,
    'insurance': 1,
    'damages': 2,
    'vehicle-details': 3,
    'attestation': 4
  };

  const stepToTab: { [key: number]: string } = {
    0: 'client-info',
    1: 'insurance',
    2: 'damages',
    3: 'vehicle-details',
    4: 'attestation'
  };

  // Repositionner manuellement le spotlight sur l'élément cible
  const repositionSpotlight = (targetSelector: string) => {
    const targetElement = document.querySelector(targetSelector);
    const spotlight = document.querySelector('.react-joyride__spotlight') as HTMLElement;
    
    if (targetElement && spotlight) {
      const rect = targetElement.getBoundingClientRect();
      spotlight.style.position = 'fixed';
      spotlight.style.top = `${rect.top - 4}px`;
      spotlight.style.left = `${rect.left - 4}px`;
      spotlight.style.width = `${rect.width + 8}px`;
      spotlight.style.height = `${rect.height + 8}px`;
    }
  };

  // Scroll vers l'élément cible et forcer recalcul Joyride
  const scrollToTarget = (targetSelector: string, callback?: () => void) => {
    setTimeout(() => {
      const element = document.querySelector(targetSelector);
      if (element) {
        // Trouver le conteneur scrollable parent (TabsContent avec overflow-y-auto)
        const scrollContainer = element.closest('[data-state="active"].overflow-y-auto') as HTMLElement;
        
        if (scrollContainer) {
          // Scroller le conteneur vers le haut pour que l'élément soit visible
          scrollContainer.scrollTop = 0;
        }
        
        // Attendre que le scroll soit terminé, puis forcer recalcul
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
          // Repositionner manuellement le spotlight
          setTimeout(() => {
            repositionSpotlight(targetSelector);
            callback?.();
          }, 100);
        }, 200);
      } else {
        callback?.();
      }
    }, 100);
  };

  // Initialiser le tour
  useEffect(() => {
    if (!isViewMode && isOpen) {
      setTimeout(() => {
        setCurrentStep(0);
        // D'abord scroller vers l'élément, PUIS activer le tour
        scrollToTarget('[data-tour="client-select"]', () => {
          setTimeout(() => {
            setRunTour(true);
          }, 100);
        });
      }, 1000);
    } else {
      setRunTour(false);
      setCurrentStep(0);
    }
  }, [isViewMode, isOpen]);

  // Synchroniser le guide avec les changements d'onglets manuels
  useEffect(() => {
    if (!isOpen || isViewMode || !activeTab) return;

    const newStep = tabToStep[activeTab];
    if (newStep !== undefined && newStep !== currentStep) {
      setCurrentStep(newStep);
      setRunTour(true);
      
      // Scroll vers l'élément cible de l'onglet
      const steps = getSteps();
      if (steps[newStep]) {
        scrollToTarget(steps[newStep].target as string);
      }
    }
  }, [activeTab, isOpen, isViewMode]);

  // Nettoyer le timer à la destruction
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  // Détecter l'upload du permis pour avancer automatiquement
  useEffect(() => {
    if (!isOpen || isViewMode || currentStep !== 0) return;

    const hasNewFrontUrl = driverLicenseFrontUrl && driverLicenseFrontUrl !== previousLicenseRef.current.front;
    const hasNewBackUrl = driverLicenseBackUrl && driverLicenseBackUrl !== previousLicenseRef.current.back;
    const hasBothSides = driverLicenseFrontUrl && driverLicenseBackUrl;

    if (hasNewFrontUrl || hasNewBackUrl) {
      previousLicenseRef.current = {
        front: driverLicenseFrontUrl || '',
        back: driverLicenseBackUrl || ''
      };
    }

    // Avancer à l'onglet assurance quand les deux côtés sont uploadés
    if (hasBothSides && (hasNewFrontUrl || hasNewBackUrl)) {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      
      if (setActiveTab) {
        setActiveTab('insurance');
      }
      
      setTimeout(() => {
        setCurrentStep(1);
        setRunTour(true);
        scrollToTarget('[data-tour="insurance-switch"]');
      }, 500);
    }
  }, [driverLicenseFrontUrl, driverLicenseBackUrl, currentStep, isOpen, isViewMode, setActiveTab]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, index, type, lifecycle } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      setCurrentStep(0);
      return;
    }

    // Repositionner le spotlight quand le tooltip apparaît
    if (action === ACTIONS.UPDATE && lifecycle === LIFECYCLE.TOOLTIP) {
      const steps = getSteps();
      if (steps[index]) {
        setTimeout(() => {
          repositionSpotlight(steps[index].target as string);
        }, 50);
      }
    }

    if (type === 'step:after') {
      if (action === 'next') {
        const nextStep = index + 1;
        const nextTab = stepToTab[nextStep];
        
        if (nextTab && setActiveTab) {
          setRunTour(false);
          setActiveTab(nextTab);
          setTimeout(() => {
            const steps = getSteps();
            if (steps[nextStep]) {
              scrollToTarget(steps[nextStep].target as string, () => {
                setCurrentStep(nextStep);
                setRunTour(true);
              });
            }
          }, 300);
        }
      } else if (action === 'prev') {
        const prevStep = Math.max(0, index - 1);
        const prevTab = stepToTab[prevStep];
        
        if (prevTab && setActiveTab) {
          setRunTour(false);
          setActiveTab(prevTab);
          setTimeout(() => {
            const steps = getSteps();
            if (steps[prevStep]) {
              scrollToTarget(steps[prevStep].target as string, () => {
                setCurrentStep(prevStep);
                setRunTour(true);
              });
            }
          }, 300);
        }
      }
    }
  };

  const getSteps = (): Step[] => [
    {
      target: '[data-tour="client-select"]',
      content: 'Sélectionnez le client et téléchargez son permis de conduire (recto et verso).',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="insurance-switch"]',
      content: 'Indiquez si le client possède une assurance et renseignez les informations si nécessaire.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="damage-assessment"]',
      content: 'Inspectez le véhicule et signalez tous les chocs et rayures existants avant le prêt.',
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="vehicle-mileage"]',
      content: 'Renseignez le kilométrage, le niveau de carburant et prenez des photos du véhicule.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="attestation"]',
      content: 'Faites lire et signer l\'attestation de prêt au client pour finaliser.',
      placement: 'top',
      disableBeacon: true,
    },
  ];

  return {
    runTour,
    stepIndex: currentStep,
    steps: getSteps(),
    handleJoyrideCallback,
  };
};
