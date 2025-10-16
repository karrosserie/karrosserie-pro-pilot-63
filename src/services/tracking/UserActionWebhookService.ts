import { onboardingService } from '../onboarding/OnboardingService';

type UserActionType = 
  | 'connexion'
  | 'import_rapport_expertise'
  | 'signature_or'
  | 'mise_planning'
  | 'creation_facture';

class UserActionWebhookService {
  private webhookUrl = 'https://n8n.karrosserie.pro/webhook/cb45ad92-6f2a-4ead-ac63-e8b207642cf1';

  async sendUserAction(action: UserActionType, additionalData?: Record<string, any>) {
    try {
      // Récupérer l'état d'onboarding actuel
      const onboardingState = onboardingService.getOnboardingState();

      const payload = {
        ...onboardingState,
        action_type: action,
        timestamp: new Date().toISOString(),
        ...additionalData
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn(`Failed to send user action webhook: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending user action webhook:', error);
    }
  }
}

export const userActionWebhookService = new UserActionWebhookService();
