
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/supabase/auth';
import { toast } from '@/hooks/use-toast';

export const useAuthActions = (setLoading: (loading: boolean) => void) => {
  const navigate = useNavigate();

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
  }, [navigate, setLoading]);

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string, firstName: string, lastName: string, phoneNumber: string) => {
    try {
      setLoading(true);
      const { user: newUser, session: newSession } = await authService.signUp({ 
        email, 
        password, 
        firstName, 
        lastName,
        phoneNumber
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
  }, [setLoading]);

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
  }, [navigate, setLoading]);

  return {
    signIn,
    signUp,
    signOut,
  };
};
