
import { Session, User } from '@supabase/supabase-js';
import { STATIC_AUTH, mockApiDelay } from '@/data/staticData';

export interface AuthSignUpData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  isTeamMember?: boolean;
}

export interface AuthError {
  message: string;
}

export const authService = {
  /**
   * Get the current session from static data
   */
  getSession: async () => {
    await mockApiDelay(200);
    return STATIC_AUTH.session as Session;
  },

  /**
   * Sign in with email and password (mock)
   */
  signInWithPassword: async (email: string, password: string) => {
    await mockApiDelay(800);
    
    // Simuler une authentification réussie pour tous les cas
    return {
      user: STATIC_AUTH.session.user as User,
      session: STATIC_AUTH.session as Session,
    };
  },

  /**
   * Sign up with email and password (mock)
   */
  signUp: async ({ email, password, firstName, lastName, phoneNumber, isTeamMember = false }: AuthSignUpData) => {
    await mockApiDelay(1000);
    
    // Simuler une inscription réussie
    return {
      user: {
        ...STATIC_AUTH.session.user,
        email,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          is_team_member: isTeamMember.toString(),
        }
      } as User,
      session: {
        ...STATIC_AUTH.session,
        user: {
          ...STATIC_AUTH.session.user,
          email,
          user_metadata: {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            is_team_member: isTeamMember.toString(),
          }
        }
      } as Session,
    };
  },

  /**
   * Sign out the current user (mock)
   */
  signOut: async () => {
    await mockApiDelay(300);
    // Ne rien faire pour la démo
  },

  /**
   * Set up auth state change listener (mock)
   */
  onAuthStateChange: (callback: (session: Session | null, user: User | null) => void) => {
    // Simuler immédiatement un utilisateur connecté
    setTimeout(() => {
      callback(STATIC_AUTH.session as Session, STATIC_AUTH.session.user as User);
    }, 100);
    
    // Retourner un mock de subscription
    return {
      unsubscribe: () => {},
    };
  },

  /**
   * Resend email verification (mock)
   */
  resendEmailVerification: async (email: string) => {
    await mockApiDelay(500);
    // Ne rien faire pour la démo
  },

  /**
   * Send password reset email (mock)
   */
  resetPassword: async (email: string) => {
    await mockApiDelay(500);
    // Ne rien faire pour la démo
  },

  /**
   * Update password (mock)
   */
  updatePassword: async (password: string) => {
    await mockApiDelay(500);
    // Ne rien faire pour la démo
  },
};
