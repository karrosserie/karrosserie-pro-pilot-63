import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/use-user-role';

export const useRoleBasedRedirect = () => {
  const navigate = useNavigate();
  const { userRole, isCarrossier, isCarrossierCourtesy, isLoading } = useUserRole();
  const [hasRedirected, setHasRedirected] = useState(false);

  const redirectBasedOnRole = useCallback(() => {
    // Attendre que le rôle soit chargé et ne pas rediriger plusieurs fois
    if (!isLoading && !hasRedirected && userRole) {
      setHasRedirected(true);
      
      // Si c'est un carrossier ou carrossier-véhicule de courtoisie, rediriger vers le planning
      if (isCarrossier || isCarrossierCourtesy) {
        navigate('/planning');
      } else {
        // Pour tous les autres rôles, rediriger vers la page d'accueil
        navigate('/');
      }
    }
  }, [navigate, isCarrossier, isCarrossierCourtesy, isLoading, hasRedirected, userRole]);

  // Reset hasRedirected quand le rôle change (cas d'un changement d'utilisateur)
  useEffect(() => {
    setHasRedirected(false);
  }, [userRole]);

  return { redirectBasedOnRole, isLoading, hasRedirected };
};