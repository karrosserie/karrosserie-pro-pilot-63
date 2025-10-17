import { useState, useEffect } from 'react';
import { Step, CallBackProps, STATUS, ACTIONS, EVENTS } from 'react-joyride';

export const useLoanFormGuide = (isViewMode: boolean, isOpen: boolean) => {
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Démarrer le tour uniquement en mode création et à l'ouverture du dialog
    if (!isViewMode && isOpen) {
      // Attendre que le DOM soit complètement chargé
      setTimeout(() => {
        // Vérifier que l'élément cible existe avant de lancer le tour
        const firstElement = document.querySelector('[data-tour="client-select"]');
        if (firstElement) {
          setStepIndex(0);
          setRunTour(true);
        } else {
          // Réessayer si l'élément n'est pas encore dans le DOM
          setTimeout(() => {
            setStepIndex(0);
            setRunTour(true);
          }, 500);
        }
      }, 1000);
    } else {
      // Réinitialiser le tour quand on ferme le dialog
      setRunTour(false);
      setStepIndex(0);
    }
  }, [isViewMode, isOpen]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, action, index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      setStepIndex(0);
    } else if (type === EVENTS.STEP_AFTER) {
      // Masquer temporairement le guide lors du passage à l'étape suivante
      if (action === ACTIONS.NEXT) {
        setStepIndex(index + 1);
        setRunTour(false);
        // Réafficher le guide après un court délai pour permettre l'interaction
        setTimeout(() => {
          setRunTour(true);
        }, 300);
      } else if (action === ACTIONS.PREV) {
        setStepIndex(Math.max(0, index - 1));
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
    stepIndex,
    steps,
    handleJoyrideCallback,
  };
};
