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
        const customError = new Error('Email not confirmed');
        customError.name = 'EmailNotConfirmed';
        throw customError;
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
      } else if (error.message === 'Email not confirmed' || error.name === 'EmailNotConfirmed') {
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
      
      // Success message after signup
      toast({
        title: "Compte créé avec succès",
        description: "Veuillez vérifier votre boîte mail et cliquer sur le lien de confirmation pour activer votre compte.",
        variant: "default",
      });
      
      return { user: newUser, session: newSession };
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue lors de l'inscription";
      
      if (error.message?.includes('duplicate key') || error.message?.includes('already registered')) {
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
      
      toast({
        title: "Email envoyé",
        description: "Un nouvel email de vérification a été envoyé. Veuillez vérifier votre boîte mail.",
        variant: "default",
      });
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

  // Reset password request
  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      await authService.resetPassword(email);
      
      toast({
        title: "Email envoyé",
        description: "Un email de réinitialisation de mot de passe a été envoyé. Veuillez vérifier votre boîte mail.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de l'email de réinitialisation",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (password: string) => {
    try {
      setLoading(true);
      await authService.updatePassword(password);
      
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès.",
        variant: "default",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du mot de passe",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resendEmailVerification,
    resetPassword,
    updatePassword,
  };
};
