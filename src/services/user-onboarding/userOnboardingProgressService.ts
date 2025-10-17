import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserCompanyId } from '@/services/supabase/auth-company';

export interface UserOnboardingProgress {
  id: string;
  user_id: string;
  company_id: string | null;
  quote_convert_help_seen: boolean;
  repair_order_help_seen: boolean;
  cession_help_seen: boolean;
  cession_select_order_help_seen: boolean;
  cession_initialize_button_help_seen: boolean;
  fleet_reservation_help_seen: boolean;
  fleet_reservation_guide_completed: boolean;
  expertise_report_prompt_seen: boolean;
  created_at: string;
  updated_at: string;
}

export type OnboardingHelpType = 
  | 'quote_convert_help_seen'
  | 'repair_order_help_seen'
  | 'cession_help_seen'
  | 'cession_select_order_help_seen'
  | 'cession_initialize_button_help_seen'
  | 'fleet_reservation_help_seen'
  | 'fleet_reservation_guide_completed'
  | 'expertise_report_prompt_seen';

class UserOnboardingProgressService {
  /**
   * Récupère les préférences d'affichage de l'utilisateur
   */
  async getUserProgress(): Promise<UserOnboardingProgress | null> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('User not authenticated', userError);
        return null;
      }

      const companyId = await getCurrentUserCompanyId();

      const { data, error } = await supabase
        .from('user_onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('company_id', companyId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user onboarding progress:', error);
        return null;
      }

      // Si aucune donnée n'existe, créer un nouvel enregistrement
      if (!data) {
        return await this.initializeUserProgress(user.id, companyId);
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProgress:', error);
      return null;
    }
  }

  /**
   * Initialise les préférences pour un nouvel utilisateur
   */
  private async initializeUserProgress(
    userId: string,
    companyId: string
  ): Promise<UserOnboardingProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_onboarding_progress')
        .insert({
          user_id: userId,
          company_id: companyId,
          quote_convert_help_seen: false,
          repair_order_help_seen: false,
          cession_help_seen: false,
          cession_select_order_help_seen: false,
          cession_initialize_button_help_seen: false,
          fleet_reservation_help_seen: false,
          fleet_reservation_guide_completed: false,
          expertise_report_prompt_seen: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error initializing user onboarding progress:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in initializeUserProgress:', error);
      return null;
    }
  }

  /**
   * Marque une aide comme vue
   */
  async markHelpAsSeen(helpType: OnboardingHelpType): Promise<boolean> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('User not authenticated', userError);
        return false;
      }

      const companyId = await getCurrentUserCompanyId();

      const { error } = await supabase
        .from('user_onboarding_progress')
        .upsert(
          {
            user_id: user.id,
            company_id: companyId,
            [helpType]: true,
          },
          {
            onConflict: 'user_id,company_id',
          }
        );

      if (error) {
        console.error(`Error marking ${helpType} as seen:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markHelpAsSeen:', error);
      return false;
    }
  }

  /**
   * Vérifie si une aide spécifique doit être affichée
   */
  async shouldShowHelp(helpType: OnboardingHelpType): Promise<boolean> {
    const progress = await this.getUserProgress();
    
    if (!progress) {
      return true; // Si pas de données, afficher l'aide
    }

    return !progress[helpType];
  }

  /**
   * Réinitialise toutes les aides (pour les tests)
   */
  async resetAllHelp(): Promise<boolean> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('User not authenticated', userError);
        return false;
      }

      const companyId = await getCurrentUserCompanyId();

      const { error } = await supabase
        .from('user_onboarding_progress')
        .update({
          quote_convert_help_seen: false,
          repair_order_help_seen: false,
          cession_help_seen: false,
          cession_select_order_help_seen: false,
          cession_initialize_button_help_seen: false,
          fleet_reservation_help_seen: false,
          fleet_reservation_guide_completed: false,
          expertise_report_prompt_seen: false,
        })
        .eq('user_id', user.id)
        .eq('company_id', companyId);

      if (error) {
        console.error('Error resetting all help:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in resetAllHelp:', error);
      return false;
    }
  }
}

export const userOnboardingProgressService = new UserOnboardingProgressService();
