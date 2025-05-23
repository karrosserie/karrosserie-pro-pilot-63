
import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { authService } from '@/services/supabase/auth';
import { profileService, Profile } from '@/services/supabase/profiles';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const profileData = await profileService.getProfileById(userId);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      setLoading(true);
      
      // Get initial session
      const initialSession = await authService.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        await fetchProfile(initialSession.user.id);
      }
      
      // Set up auth state change listener
      const subscription = authService.onAuthStateChange((currentSession, currentUser) => {
        setSession(currentSession);
        setUser(currentUser);
        
        if (currentUser) {
          fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
      });
      
      setLoading(false);
      
      // Cleanup subscription
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { session: newSession, user: newUser } = await authService.signInWithPassword(email, password);
      
      if (!newUser) {
        throw new Error('Connexion échouée. Veuillez vérifier vos identifiants.');
      }
      
      // Check if email is verified
      if (newUser.email_confirmed_at === null) {
        throw new Error('Email pas encore confirmée. Veuillez vérifier votre boîte mail ou demander un nouvel email de confirmation.');
      }
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
      navigate('/');
      return { session: newSession, user: newUser };
    } catch (error: any) {
      let errorMessage = error.message;
      
      if (error.message === 'Invalid login credentials') {
        errorMessage = 'Identifiants invalides. Veuillez vérifier votre email et mot de passe.';
      } else if (error.message === 'Email not confirmed') {
        errorMessage = 'Email pas encore confirmée. Veuillez vérifier votre boîte mail.';
      }
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true);
      const { user: newUser, session: newSession } = await authService.signUp({ 
        email, 
        password, 
        firstName, 
        lastName 
      });
      
      if (!newUser) {
        throw new Error("L'inscription a échoué. Veuillez réessayer.");
      }
      
      return { user: newUser, session: newSession };
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue lors de l'inscription";
      
      if (error.message?.includes('duplicate key')) {
        errorMessage = "Cet email est déjà utilisé";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await authService.signOut();
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous êtes maintenant déconnecté.",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Resend email verification
  const resendEmailVerification = useCallback(async (email: string) => {
    try {
      setLoading(true);
      await authService.resendEmailVerification(email);
    } catch (error: any) {
      toast({
        title: "Erreur d'envoi d'e-mail",
        description: error.message || "Une erreur est survenue lors de l'envoi de l'e-mail de vérification",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resendEmailVerification,
  };
};
