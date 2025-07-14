import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserPreferences {
  id?: string;
  user_id: string;
  language: string;
  timezone: string;
  currency: string;
  invoice_template: string;
  show_client_signature: boolean;
  show_repair_order_details: boolean;
  show_zero_price_products: boolean;
}

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
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
            user_id: user.id,
            language: 'fr',
            timezone: 'Europe/Paris',
            currency: 'EUR',
            invoice_template: 'default',
            show_client_signature: true,
            show_repair_order_details: true,
            show_zero_price_products: false,
          };

          const { data: newData, error: insertError } = await supabase
            .from('user_preferences')
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
  }, [user?.id]);

  return {
    preferences,
    isLoading,
  };
}