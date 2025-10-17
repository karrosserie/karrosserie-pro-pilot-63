import { useState, useEffect } from 'react';
import { Step, CallBackProps, STATUS } from 'react-joyride';

export const useLoanFormGuide = (isViewMode: boolean, isOpen: boolean) => {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Démarrer le tour uniquement en mode création et à l'ouverture du dialog
    console.log('Loan Guide - isViewMode:', isViewMode, 'isOpen:', isOpen);
    if (!isViewMode && isOpen) {
      const hasSeenLoanGuide = localStorage.getItem('fleet-loan-guide-seen');
      console.log('Loan Guide - hasSeenLoanGuide:', hasSeenLoanGuide);
      if (!hasSeenLoanGuide) {
        // Petit délai pour s'assurer que le DOM est chargé
        console.log('Loan Guide - Starting tour in 500ms');
        setTimeout(() => {
          console.log('Loan Guide - setRunTour(true)');
          setRunTour(true);
        }, 500);
      } else {
        console.log('Loan Guide - Already seen, not showing');
      }
    }
  }, [isViewMode, isOpen]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem('fleet-loan-guide-seen', 'true');
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
    steps,
    handleJoyrideCallback,
  };
};
