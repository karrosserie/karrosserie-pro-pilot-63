import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface TrackingEvent {
  eventType: 'page_view' | 'form_interaction' | 'business_action' | 'error' | 'abandon';
  eventCategory: 'navigation' | 'form' | 'business' | 'system';
  eventName: string;
  pageUrl: string;
  componentName?: string;
  metadata?: Record<string, any>;
}

export interface FunnelStep {
  funnelName: string;
  stepName: string;
  stepOrder: number;
  status: 'started' | 'completed' | 'abandoned';
  formData?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ErrorEvent {
  errorType: 'form_error' | 'navigation_error' | 'system_error' | 'funnel_abandon';
  errorMessage: string;
  pageUrl: string;
  componentName?: string;
  funnelName?: string;
  stepName?: string;
  formData?: Record<string, any>;
  stackTrace?: string;
  metadata?: Record<string, any>;
}

class TrackingService {
  private sessionId: string;
  private userId: string | null = null;
  private companyId: string | null = null;
  private currentPageUrl: string = '';
  private pageEnterTime: Date | null = null;
  private isSessionActive = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    // Initialiser de manière asynchrone pour éviter les erreurs au chargement
    this.initializeSession().catch(console.error);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${uuidv4().slice(0, 8)}`;
  }

  private async initializeSession() {
    try {
      // Attendre un peu pour s'assurer que Supabase est initialisé
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.warn('Auth not ready yet, tracking will be initialized later');
        return;
      }
      
      if (user) {
        this.userId = user.id;
        
        // Récupérer la company_id de l'utilisateur
        try {
          const { data: userCompany } = await supabase
            .from('user_companies')
            .select('company_id')
            .eq('user_id', user.id)
            .eq('active', true)
            .single();
          
          this.companyId = userCompany?.company_id || null;
          
          // Créer la session
          await this.createSession();
          this.isSessionActive = true;
        } catch (companyError) {
          console.warn('Could not fetch company info, continuing without it');
          this.isSessionActive = true;
        }

        // Temporarily disable auth state listener to prevent WebSocket errors
        // TODO: Re-implement with proper browser WebSocket handling
        // supabase.auth.onAuthStateChange((event, session) => {
        //   if (event === 'SIGNED_OUT') {
        //     this.endSession().catch(console.error);
        //   } else if (event === 'SIGNED_IN' && !this.isSessionActive) {
        //     this.initializeSession().catch(console.error);
        //   }
        // });
      }
    } catch (error) {
      console.warn('Tracking service initialization failed, continuing without tracking:', error);
    }
  }

  private async createSession() {
    if (!this.userId) return;

    const deviceInfo = {
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    try {
      await supabase
        .from('user_sessions')
        .insert({
          user_id: this.userId,
          company_id: this.companyId,
          session_id: this.sessionId,
          user_agent: navigator.userAgent,
          device_info: deviceInfo,
        });
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
    }
  }

  public async trackEvent(event: TrackingEvent) {
    if (!this.userId || !this.isSessionActive) return;

    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: this.userId,
          company_id: this.companyId,
          session_id: this.sessionId,
          event_type: event.eventType,
          event_category: event.eventCategory,
          event_name: event.eventName,
          page_url: event.pageUrl,
          component_name: event.componentName,
          metadata: event.metadata || {},
        });
    } catch (error) {
      // Silently fail to avoid breaking the app
      console.warn('Could not track event:', error);
    }
  }

  public async trackPageView(pageUrl: string) {
    // Terminer la visite de la page précédente
    await this.endPageVisit();

    // Commencer la nouvelle visite
    this.currentPageUrl = pageUrl;
    this.pageEnterTime = new Date();

    await this.trackEvent({
      eventType: 'page_view',
      eventCategory: 'navigation',
      eventName: 'page_visit',
      pageUrl,
    });

    // Enregistrer l'entrée sur la page
    if (this.userId) {
      try {
        await supabase
          .from('page_visit_durations')
          .insert({
            user_id: this.userId,
            company_id: this.companyId,
            session_id: this.sessionId,
            page_url: pageUrl,
            enter_time: this.pageEnterTime.toISOString(),
          });
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'entrée sur la page:', error);
      }
    }
  }

  private async endPageVisit() {
    if (!this.userId || !this.pageEnterTime || !this.currentPageUrl) return;

    const exitTime = new Date();
    const duration = Math.round((exitTime.getTime() - this.pageEnterTime.getTime()) / 1000);

    try {
      await supabase
        .from('page_visit_durations')
        .update({
          exit_time: exitTime.toISOString(),
          duration_seconds: duration,
        })
        .eq('user_id', this.userId)
        .eq('session_id', this.sessionId)
        .eq('page_url', this.currentPageUrl)
        .is('exit_time', null);
    } catch (error) {
      console.error('Erreur lors de la fin de visite de page:', error);
    }
  }

  public async trackFunnelStep(step: FunnelStep) {
    if (!this.userId || !this.isSessionActive) return;

    try {
      const stepData: any = {
        user_id: this.userId,
        company_id: this.companyId,
        session_id: this.sessionId,
        funnel_name: step.funnelName,
        step_name: step.stepName,
        step_order: step.stepOrder,
        status: step.status,
        form_data: step.formData || {},
        metadata: step.metadata || {},
      };

      if (step.status === 'completed' || step.status === 'abandoned') {
        stepData.end_time = new Date().toISOString();
      }

      await supabase
        .from('user_funnel_progress')
        .insert(stepData);
    } catch (error) {
      console.error('Erreur lors du tracking du funnel:', error);
    }
  }

  public async trackError(error: ErrorEvent) {
    if (!this.userId || !this.isSessionActive) return;

    try {
      await supabase
        .from('user_errors_abandons')
        .insert({
          user_id: this.userId,
          company_id: this.companyId,
          session_id: this.sessionId,
          error_type: error.errorType,
          error_message: error.errorMessage,
          page_url: error.pageUrl,
          component_name: error.componentName,
          funnel_name: error.funnelName,
          step_name: error.stepName,
          form_data: error.formData || {},
          stack_trace: error.stackTrace,
          metadata: error.metadata || {},
        });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'erreur:', error);
    }
  }

  public async trackFormInteraction(
    formName: string, 
    fieldName: string, 
    action: 'focus' | 'blur' | 'change' | 'submit' | 'error',
    value?: any
  ) {
    await this.trackEvent({
      eventType: 'form_interaction',
      eventCategory: 'form',
      eventName: `form_${action}`,
      pageUrl: window.location.pathname,
      componentName: formName,
      metadata: {
        fieldName,
        action,
        value: value !== undefined ? String(value) : undefined,
      },
    });
  }

  public async trackBusinessAction(
    actionName: string,
    entityType: string,
    entityId?: string,
    metadata?: Record<string, any>
  ) {
    await this.trackEvent({
      eventType: 'business_action',
      eventCategory: 'business',
      eventName: actionName,
      pageUrl: window.location.pathname,
      metadata: {
        entityType,
        entityId,
        ...metadata,
      },
    });
  }

  public async endSession() {
    if (!this.userId || !this.isSessionActive) return;

    await this.endPageVisit();

    const endTime = new Date();
    try {
      await supabase
        .from('user_sessions')
        .update({
          end_time: endTime.toISOString(),
        })
        .eq('session_id', this.sessionId);
      
      this.isSessionActive = false;
    } catch (error) {
      console.error('Erreur lors de la fin de session:', error);
    }
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getUserId(): string | null {
    return this.userId;
  }

  public getCompanyId(): string | null {
    return this.companyId;
  }
}

// Instance globale du service de tracking
export const trackingService = new TrackingService();

// Nettoyer la session à la fermeture de la page 
window.addEventListener('beforeunload', () => {
  trackingService.endSession();
});