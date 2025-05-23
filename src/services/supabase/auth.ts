
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthSignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
}

export const authService = {
  /**
   * Get the current session from Supabase
   */
  getSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  /**
   * Sign in with email and password
   */
  signInWithPassword: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Sign up with email and password
   */
  signUp: async ({ email, password, firstName, lastName }: AuthSignUpData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  /**
   * Set up auth state change listener
   */
  onAuthStateChange: (callback: (session: Session | null, user: User | null) => void) => {
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      callback(session, session?.user ?? null);
    });

    return data.subscription;
  },

  /**
   * Resend email verification
   */
  resendEmailVerification: async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    });
    
    if (error) {
      throw error;
    }
  },
};
