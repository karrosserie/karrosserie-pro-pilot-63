import { onboardingService } from '../onboarding/OnboardingService';
import { supabase } from '@/integrations/supabase/client';

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
      
      // Récupérer le user_id de la session
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || additionalData?.user_id;

      const payload = {
        ...onboardingState,
        user_id: userId,
        action_type: action,
        timestamp: new Date().toISOString(),
        ...additionalData
      };

      console.log('🌐 Envoi webhook vers:', this.webhookUrl);
      console.log('📦 Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📡 Réponse webhook:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.warn(`❌ Failed to send user action webhook: ${response.status}`, responseText);
        throw new Error(`Webhook failed with status ${response.status}: ${responseText}`);
      }

      console.log('✅ Webhook envoyé avec succès');
    } catch (error) {
      console.error('❌ Error sending user action webhook:', error);
      throw error; // Re-throw pour que l'appelant puisse gérer l'erreur
    }
  }
}

export const userActionWebhookService = new UserActionWebhookService();
