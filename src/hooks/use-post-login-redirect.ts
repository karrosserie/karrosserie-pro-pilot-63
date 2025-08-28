import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleBasedRedirect } from '@/hooks/use-role-based-redirect';

export const usePostLoginRedirect = () => {
  const { user } = useAuth();
  const { redirectBasedOnRole } = useRoleBasedRedirect();

  useEffect(() => {
    // Délai pour laisser le temps au rôle de se charger après connexion
    if (user) {
      const timer = setTimeout(() => {
        redirectBasedOnRole();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, redirectBasedOnRole]);
};