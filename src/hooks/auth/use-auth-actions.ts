
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/supabase/auth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { welcomeTourService } from '@/services/welcomeTour/WelcomeTourService';

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
      
      // Check if user is active in any company
      const { data: userCompanies, error } = await supabase
        .from('user_companies')
        .select('active')
        .eq('user_id', newUser.id);
      
      if (error) {
        console.error('Error checking user company status:', error);
      }
      
      // If user has no companies or all companies have active = false, block login
      const hasActiveCompany = userCompanies && userCompanies.some(uc => uc.active === true);
      
      if (!hasActiveCompany) {
        // Sign out the user immediately
        await authService.signOut();
        throw new Error('Votre compte a été désactivé. Veuillez contacter votre administrateur.');
      }
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
      
      // Vérifier si c'est un client migré (si le champ existe)
      try {
        const userCompany = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', newUser.id)
          .eq('active', true)
          .single();

        if (userCompany.data?.company_id) {
          const { data: companyData } = await supabase
            .from('company_info')
            .select('*')
            .eq('id', userCompany.data.company_id)
            .single();
          
          // Rediriger vers /welcome si client migré et n'a pas vu la page de bienvenue
          if (companyData && 'is_merged' in companyData && companyData.is_merged && !welcomeTourService.hasSeenWelcome()) {
            navigate('/welcome');
            return { session: newSession, user: newUser };
          }
        }
      } catch (error) {
        console.log('No is_merged field or error checking:', error);
      }
      
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
  const signUp = useCallback(async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phoneNumber: string, 
    isTeamMember: boolean = false,
    companyData?: {
      siren: string;
      companyName: string;
      legalForm: string;
      siret: string;
      vatNumber: string;
      address: string;
      nafCode: string;
    }
  ) => {
    try {
      setLoading(true);
      const { user: newUser, session: newSession } = await authService.signUp({ 
        email, 
        password, 
        firstName, 
        lastName,
        phoneNumber,
        isTeamMember,
        ...companyData
      });
      
      if (!newUser) {
        throw new Error("L'inscription a échoué. Veuillez réessayer.");
      }
      
      // Géocoder l'adresse de l'entreprise après création réussie
      if (!isTeamMember && companyData?.address) {
        try {
          console.log('Appel de la fonction geocode-company-address avec adresse:', companyData.address);
          
          const { data: geocodeResult, error: geocodeError } = await supabase.functions.invoke('geocode-company-address', {
            body: { address: companyData.address }
          });

          if (geocodeError) {
            console.error('Erreur géocodage:', geocodeError);
          } else if (geocodeResult?.success) {
            console.log('Géocodage réussi:', geocodeResult);
            
            // Mettre à jour les coordonnées de l'entreprise
            const { data: companies, error: fetchError } = await supabase
              .from('user_companies')
              .select('company_id')
              .eq('user_id', newUser.id)
              .eq('active', true);

            if (!fetchError && companies && companies.length > 0) {
              const companyId = companies[0].company_id;
              
              await supabase
                .from('company_info')
                .update({
                  latitude: geocodeResult.latitude,
                  longitude: geocodeResult.longitude
                })
                .eq('id', companyId);
                
              console.log('Coordonnées mises à jour pour l\'entreprise:', companyId);
            }
          }
        } catch (error) {
          console.error('Erreur lors du géocodage:', error);
        }
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
