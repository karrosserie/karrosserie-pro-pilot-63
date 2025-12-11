import { useState, useEffect, useRef } from 'react';
import { Step, CallBackProps, STATUS } from 'react-joyride';

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

  // Scroll vers l'élément cible
  const scrollToTarget = (targetSelector: string) => {
    setTimeout(() => {
      const element = document.querySelector(targetSelector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Initialiser le tour
  useEffect(() => {
    if (!isViewMode && isOpen) {
      setTimeout(() => {
        setCurrentStep(0);
        setRunTour(true);
        scrollToTarget('[data-tour="client-select"]');
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
    const { status, action, index, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      setCurrentStep(0);
      return;
    }

    if (type === 'step:after') {
      if (action === 'next') {
        const nextStep = index + 1;
        const nextTab = stepToTab[nextStep];
        
        if (nextTab && setActiveTab) {
          // Changer d'onglet puis mettre à jour le step
          setActiveTab(nextTab);
          setTimeout(() => {
            setCurrentStep(nextStep);
            setRunTour(true);
            const steps = getSteps();
            if (steps[nextStep]) {
              scrollToTarget(steps[nextStep].target as string);
            }
          }, 300);
        }
      } else if (action === 'prev') {
        const prevStep = Math.max(0, index - 1);
        const prevTab = stepToTab[prevStep];
        
        if (prevTab && setActiveTab) {
          setActiveTab(prevTab);
          setTimeout(() => {
            setCurrentStep(prevStep);
            setRunTour(true);
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
