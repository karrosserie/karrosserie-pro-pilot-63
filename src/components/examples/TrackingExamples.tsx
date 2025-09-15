// Exemples d'utilisation du système de tracking

import { useFormTracking } from '@/hooks/tracking/useFormTracking';
import { useBusinessActionTracking } from '@/hooks/tracking/useBusinessActionTracking';

// Exemple d'utilisation dans un formulaire de création de client
export const ClientFormExample = () => {
  const { trackFormStart, trackFieldInteraction, trackFormSubmit, trackFormError } = useFormTracking({
    formName: 'client_creation_form',
    funnelName: 'create_client',
    stepName: 'client_info',
    stepOrder: 1,
  });

  const { trackClientAction } = useBusinessActionTracking();

  const handleSubmit = (data: any) => {
    try {
      trackFormSubmit(data);
      trackClientAction('create', undefined, { source: 'manual_form' });
    } catch (error) {
      trackFormError('Erreur lors de la création du client');
    }
  };

  return null; // Interface exemple
};

// Les hooks sont maintenant disponibles dans toute l'application
// Le tracking automatique des pages est activé via TrackingProvider
// Les erreurs globales sont automatiquement trackées