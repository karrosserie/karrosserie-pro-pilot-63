
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/supabase/auth';
import { toast } from '@/hooks/use-toast';

export const useAuthUtilities = (setLoading: (loading: boolean) => void) => {
  const navigate = useNavigate();

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
  }, [setLoading]);

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
  }, [setLoading]);

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
  }, [navigate, setLoading]);

  return {
    resendEmailVerification,
    resetPassword,
    updatePassword,
  };
};
