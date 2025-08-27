import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'Propriétaire' | 'Carrossier' | 'Carrossier-vehicule de courtoisie' | 'Responsable' | 'Responsable administratif' | null;

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserRole = async () => {
      if (!user?.id) {
        setRole(null);
        return;
      }

      // Check for admin impersonation first
      let adminImpersonation = null;
      try {
        adminImpersonation = localStorage.getItem('admin_impersonation');
      } catch (error) {
        console.warn('Unable to access localStorage:', error);
        // Continue with normal flow if localStorage is not available
      }
      
      if (adminImpersonation) {
        try {
          const impersonationData = JSON.parse(adminImpersonation);
          
          // Pour l'impersonation, on utilise l'ID de l'utilisateur impersoné
          if (impersonationData.user_id && impersonationData.company_id) {
            const { data, error } = await supabase
              .from('user_companies')
              .select('role')
              .eq('user_id', impersonationData.user_id)
              .eq('company_id', impersonationData.company_id)
              .eq('active', true)
              .maybeSingle();

            if (error) {
              console.error('Erreur lors de la récupération du rôle (impersonation):', error);
              setRole(null);
            } else if (data) {
              setRole(data.role as UserRole);
            } else {
              // Aucune donnée trouvée, définir un rôle par défaut pour l'impersonation
              setRole('Propriétaire');
            }
            setIsLoading(false);
            return;
          } else {
            console.error('Données d\'impersonation incomplètes:', impersonationData);
            // Continue with normal flow
          }
        } catch (error) {
          console.error('Erreur lors du parsing des données d\'impersonation:', error);
          // Continue with normal flow
        }
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_companies')
          .select('role')
          .eq('user_id', user.id)
          .eq('active', true)
          .maybeSingle();

        if (error || !data) {
          console.error('Erreur lors de la récupération du rôle:', error);
          setRole(null);
        } else {
          setRole(data.role as UserRole);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle:', error);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUserRole();
  }, [user?.id]);

  return { role, isLoading };
}