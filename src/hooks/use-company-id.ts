import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useCompanyId() {
  const { user } = useAuth();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCompanyId = async () => {
      if (!user?.id) {
        setCompanyId(null);
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
  }, [user?.id]);

  return { companyId, isLoading };
}