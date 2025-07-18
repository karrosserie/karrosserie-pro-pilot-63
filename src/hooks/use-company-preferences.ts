import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/hooks/use-company';
import { supabase } from '@/integrations/supabase/client';

interface CompanyPreferences {
  id?: string;
  company_id: string;
  language: string;
  timezone: string;
  currency: string;
  invoice_template: string;
  show_client_signature: boolean;
  show_repair_order_details: boolean;
  show_zero_price_products: boolean;
}

export function useCompanyPreferences() {
  const { user } = useAuth();
  const { companyData } = useCompany();
  const [preferences, setPreferences] = useState<CompanyPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user || !companyData?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('company_preferences')
          .select('*')
          .eq('company_id', companyData.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Erreur lors du chargement des préférences:', error);
          return;
        }

        if (data) {
          setPreferences(data);
        } else {
          // Créer des préférences par défaut si elles n'existent pas
          const defaultPreferences = {
            company_id: companyData.id,
            language: 'fr',
            timezone: 'Europe/Paris',
            currency: 'EUR',
            invoice_template: 'default',
            show_client_signature: true,
            show_repair_order_details: true,
            show_zero_price_products: false,
          };

          const { data: newData, error: insertError } = await supabase
            .from('company_preferences')
            .insert(defaultPreferences)
            .select()
            .single();

          if (insertError) {
            console.error('Erreur lors de la création des préférences:', insertError);
          } else {
            setPreferences(newData);
          }
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id, companyData?.id]);

  return {
    preferences,
    isLoading,
  };
}