import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/hooks/use-company';
import { supabase } from '@/integrations/supabase/client';

export function useUserRole() {
  const { user } = useAuth();
  const { companyData } = useCompany();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user || !companyData?.id) {
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_companies')
          .select('role')
          .eq('user_id', user.id)
          .eq('company_id', companyData.id)
          .eq('active', true)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération du rôle:', error);
          setUserRole(null);
        } else {
          setUserRole(data?.role || null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user?.id, companyData?.id]);

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