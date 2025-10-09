import {
  OnboardingState,
  TunnelKey,
  StepKey,
  TunnelProgress,
  Tunnel1Steps,
  Tunnel2Steps,
  Tunnel3Steps,
} from '@/types/onboarding';

const ONBOARDING_KEY = 'onboarding_state';
const ONBOARDING_VERSION = '1.0.0';

class OnboardingService {
  /**
   * Initialise l'état d'onboarding pour un nouvel utilisateur
   */
  initOnboardingState(userId: string, companyId?: string): OnboardingState {
    const initialState: OnboardingState = {
      version: ONBOARDING_VERSION,
      userId,
      companyId,
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      tunnel1: {
        profileCompleted: { completed: false },
        companySirenCompleted: { completed: false },
        addressValidated: { completed: false },
        logoAdded: { completed: false },
        employeesAdded: { completed: false, employeesCount: 0 },
      },
      tunnel2: {
        reportImported: { completed: false },
        automaticDigitization: { completed: false },
        quoteToRepairOrder: { completed: false },
        sentForSignature: { completed: false },
        orderToInvoice: { completed: false },
        addedToPlanning: { completed: false },
        assignmentOfClaimsCreated: { completed: false },
        paintWeighingDone: { completed: false },
      },
      tunnel3: {
        fleetVehicleAdded: { completed: false },
        vehicleLoanCreated: { completed: false },
        vehicleReturnCompleted: { completed: false },
        violationAdded: { completed: false },
        antaiDenunciationGenerated: { completed: false },
      },
    };

    this.saveState(initialState);
    return initialState;
  }

  /**
   * Récupère l'état d'onboarding depuis localStorage
   */
  getOnboardingState(): OnboardingState | null {
    try {
      const stored = localStorage.getItem(ONBOARDING_KEY);
      if (!stored) return null;

      const state = JSON.parse(stored) as OnboardingState;
      
      // Vérifier la version et migrer si nécessaire
      if (state.version !== ONBOARDING_VERSION) {
        console.warn('Onboarding state version mismatch, migration may be needed');
      }

      return state;
    } catch (error) {
      console.error('Error reading onboarding state:', error);
      return null;
    }
  }

  /**
   * Sauvegarde l'état d'onboarding dans localStorage et envoie au webhook
   */
  private saveState(state: OnboardingState): void {
    try {
      state.lastUpdatedAt = new Date().toISOString();
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(state));
      
      // Déclencher un événement personnalisé pour notifier les hooks
      window.dispatchEvent(new CustomEvent('onboarding-updated', { detail: state }));
      
      // Envoyer l'état au webhook n8n de manière asynchrone (ne pas bloquer)
      this.sendToWebhook(state).catch(error => {
        console.error('[Onboarding] Error sending to webhook:', error);
      });
    } catch (error) {
      console.error('Error saving onboarding state:', error);
    }
  }

  /**
   * Envoie l'état d'onboarding au webhook n8n
   */
  private async sendToWebhook(state: OnboardingState): Promise<void> {
    try {
      const webhookUrl = 'https://n8n.karrosserie.pro/webhook/e0f06fb8-c636-4592-8697-7515418689ef';
      
      const payload = {
        onboardingState: state,
        company_id: state.companyId
      };

      console.log('[Onboarding] Sending state to webhook:', webhookUrl);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed with status ${response.status}`);
      }

      console.log('[Onboarding] Successfully sent state to webhook');
    } catch (error) {
      console.error('[Onboarding] Failed to send to webhook:', error);
      // Ne pas propager l'erreur pour ne pas bloquer le flux principal
    }
  }

  /**
   * Met à jour une étape spécifique d'onboarding
   */
  updateOnboardingStep(
    tunnel: TunnelKey,
    step: StepKey,
    data: Partial<any>
  ): void {
    let state = this.getOnboardingState();

    if (!state) {
      console.warn('No onboarding state found, creating new one');
      state = this.initOnboardingState('unknown');
    }

    // Mettre à jour l'étape
    const tunnelSteps = state[tunnel] as any;
    if (tunnelSteps && step in tunnelSteps) {
      tunnelSteps[step] = {
        ...tunnelSteps[step],
        ...data,
        completed: true,
        completedAt: new Date().toISOString(),
      };

      this.saveState(state);

      console.log(`[Onboarding] Step completed: ${tunnel}.${step}`, data);
    } else {
      console.error(`[Onboarding] Invalid tunnel or step: ${tunnel}.${step}`);
    }
  }

  /**
   * Vérifie si une étape est complétée
   */
  isStepCompleted(tunnel: TunnelKey, step: StepKey): boolean {
    const state = this.getOnboardingState();
    if (!state) return false;

    const tunnelSteps = state[tunnel] as any;
    return tunnelSteps && step in tunnelSteps && tunnelSteps[step]?.completed === true;
  }

  /**
   * Calcule la progression d'un tunnel spécifique
   */
  getTunnelProgress(tunnel: TunnelKey): TunnelProgress {
    const state = this.getOnboardingState();
    if (!state) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const tunnelSteps = state[tunnel] as Tunnel1Steps | Tunnel2Steps | Tunnel3Steps;
    const steps = Object.values(tunnelSteps);
    const total = steps.length;
    const completed = steps.filter(step => step.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  }

  /**
   * Calcule la progression globale sur tous les tunnels
   */
  getOverallProgress(): TunnelProgress {
    const state = this.getOnboardingState();
    if (!state) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const tunnels: TunnelKey[] = ['tunnel1', 'tunnel2', 'tunnel3'];
    let totalCompleted = 0;
    let totalSteps = 0;

    tunnels.forEach(tunnel => {
      const progress = this.getTunnelProgress(tunnel);
      totalCompleted += progress.completed;
      totalSteps += progress.total;
    });

    const percentage = totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0;

    return { completed: totalCompleted, total: totalSteps, percentage };
  }

  /**
   * Réinitialise complètement l'onboarding (pour debug/test)
   */
  resetOnboarding(): void {
    localStorage.removeItem(ONBOARDING_KEY);
    console.log('[Onboarding] State reset');
  }

  /**
   * Met à jour uniquement le userId ou companyId
   */
  updateMetadata(userId?: string, companyId?: string): void {
    const state = this.getOnboardingState();
    if (state) {
      if (userId) state.userId = userId;
      if (companyId) state.companyId = companyId;
      this.saveState(state);
    }
  }
}

// Export singleton
export const onboardingService = new OnboardingService();
