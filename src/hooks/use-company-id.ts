import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DEMO_MODE } from '@/services/demoService';

export function useCompanyId() {
  const { user } = useAuth();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCompanyId = async () => {
      if (DEMO_MODE) {
        setCompanyId('00000000-0000-4000-8000-000000000002');
        setIsLoading(false);
        return;
      }
      
      if (!user?.id) {
        setCompanyId(null);
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
          setCompanyId(impersonationData.company_id);
          setIsLoading(false);
          return;
        } catch (error) {
          console.error('Erreur lors du parsing des données d\'impersonation:', error);
          // Continue with normal flow
        }
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
  }, [user?.id]);

  return { companyId, isLoading };
}