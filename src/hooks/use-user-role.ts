import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompanyId } from '@/hooks/use-company-id';
import { supabase } from '@/integrations/supabase/client';

export function useUserRole() {
  const { user } = useAuth();
  const { companyId, isLoading: companyLoading } = useCompanyId();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      console.log('🔍 useUserRole - Debug:', { 
        userId: user?.id, 
        companyId, 
        companyLoading 
      });

      if (!user || !companyId || companyLoading) {
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_companies')
          .select('role')
          .eq('user_id', user.id)
          .eq('company_id', companyId)
          .eq('active', true)
          .single();

        console.log('🔍 useUserRole - Supabase response:', { data, error });

        if (error) {
          console.error('Erreur lors de la récupération du rôle:', error);
          setUserRole(null);
        } else {
          setUserRole(data?.role || null);
          console.log('🔍 useUserRole - Role set to:', data?.role);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user?.id, companyId, companyLoading]);

  return {
    userRole,
    isLoading,
    // Helper functions for role checking
    isOwner: userRole === 'Propriétaire',
    isCarrossier: userRole === 'carrossier',
    isCarrossierCourtesy: userRole === 'carrossier-vehicule de courtoisie',
    isResponsable: userRole === 'responsable',
    isResponsableAdmin: userRole === 'responsable administratif',
  };
}