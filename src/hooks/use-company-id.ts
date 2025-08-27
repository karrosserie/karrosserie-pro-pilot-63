import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useCompanyId() {
  const { user, profile } = useAuth();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCompanyId = async () => {
      if (!user?.id) {
        setCompanyId(null);
        return;
      }

      // Check for admin impersonation first
      const adminImpersonation = localStorage.getItem('admin_impersonation');
      if (adminImpersonation) {
        try {
          const impersonationData = JSON.parse(adminImpersonation);
          setCompanyId(impersonationData.company_id);
          setIsLoading(false);
          return;
        } catch (error) {
          console.error('Erreur lors du parsing des données d\'impersonation:', error);
          // Continue with normal flow
        }
      }

      // Si l'utilisateur est admin et sur une page admin, ne pas récupérer de company_id
      // Cela forcera l'utilisation des politiques RLS globales
      const isAdmin = profile?.role === 'admin';
      const isOnAdminPage = window.location.pathname.startsWith('/admin/');
      
      if (isAdmin && isOnAdminPage && !adminImpersonation) {
        setCompanyId(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', user.id)
          .eq('active', true)
          .single();

        if (error || !data) {
          console.error('Erreur lors de la récupération du company_id:', error);
          setCompanyId(null);
        } else {
          setCompanyId(data.company_id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du company_id:', error);
        setCompanyId(null);
      } finally {
        setIsLoading(false);
      }
    };

    getCompanyId();
  }, [user?.id, profile?.role]);

  return { companyId, isLoading };
}