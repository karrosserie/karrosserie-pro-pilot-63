import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/hooks/use-company';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
  show_repair_order_on_documents: boolean;
  show_client_signature_repair_orders: boolean;
  use_date_based_reference: boolean;
  show_payment_details: boolean;
  set_activities_as_homepage: boolean;
  show_warning_text: boolean;
  next_repair_order_ref: string;
  next_invoice_ref: string;
  next_credit_ref: string;
  ai_relance_enabled: boolean;
  ai_relance_delay_before_first?: number;
  ai_relance_max_relances?: number;
  ai_relance_channels_email?: boolean;
  ai_relance_channels_sms?: boolean;
  ai_relance_channels_whatsapp?: boolean;
  ai_relance_channels_phone?: boolean;
  ai_relance_channels_mail?: boolean;
  ai_relance_auto_mise_en_demeure?: boolean;
  ai_relance_prompt?: string;
  ai_relance_tonality?: string;
  payment_details?: string;
  invoice_non_engagement_clause?: string;
  repair_order_non_engagement_clause?: string;
  payment_conditions?: string;
  late_payment_penalties?: string;
  company_details?: string;
}

export function useCompanyPreferences() {
  const { user } = useAuth();
  const { companyData } = useCompany();
  const [preferences, setPreferences] = useState<CompanyPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
            show_repair_order_on_documents: false,
            show_client_signature_repair_orders: true,
            use_date_based_reference: false,
            show_payment_details: true,
            set_activities_as_homepage: true,
            show_warning_text: true,
            next_repair_order_ref: '1',
            next_invoice_ref: '1',
            next_credit_ref: '1',
            ai_relance_enabled: false,
            ai_relance_delay_before_first: 30,
            ai_relance_max_relances: 5,
            ai_relance_channels_email: true,
            ai_relance_channels_sms: true,
            ai_relance_channels_whatsapp: false,
            ai_relance_channels_phone: false,
            ai_relance_channels_mail: false,
            ai_relance_auto_mise_en_demeure: true,
            ai_relance_prompt: 'Rédigez une relance de paiement professionnelle et courtoise pour la facture {facture_ref} d\'un montant de {montant}€ échue depuis {jours_retard} jours pour le client {nom_client}.',
            ai_relance_tonality: 'professional',
            payment_details: '',
            invoice_non_engagement_clause: '',
            repair_order_non_engagement_clause: '',
            payment_conditions: '',
            late_payment_penalties: '',
            company_details: '',
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

  const updateAiRelanceStatus = async (enabled: boolean) => {
    if (!companyData?.id || !preferences) return;

    try {
      const { error } = await supabase
        .from('company_preferences')
        .update({ ai_relance_enabled: enabled })
        .eq('company_id', companyData.id);

      if (error) {
        console.error('Error updating AI relance status:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le statut de la relance IA",
          variant: "destructive",
        });
        return;
      }

      setPreferences(prev => prev ? { ...prev, ai_relance_enabled: enabled } : null);
      
      toast({
        title: "Succès",
        description: `Relance IA ${enabled ? 'activée' : 'désactivée'}`,
      });
    } catch (error) {
      console.error('Error in updateAiRelanceStatus:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    }
  };

  const updateAiRelanceSettings = async (settings: Partial<CompanyPreferences>) => {
    if (!companyData?.id || !preferences) return;

    try {
      const { error } = await supabase
        .from('company_preferences')
        .update(settings)
        .eq('company_id', companyData.id);

      if (error) {
        console.error('Error updating AI relance settings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour les paramètres de relance IA",
          variant: "destructive",
        });
        return;
      }

      setPreferences(prev => prev ? { ...prev, ...settings } : null);
      
      toast({
        title: "Succès",
        description: "Paramètres de relance IA sauvegardés avec succès",
      });
    } catch (error) {
      console.error('Error in updateAiRelanceSettings:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    }
  };

  return {
    preferences,
    isLoading,
    updateAiRelanceStatus,
    updateAiRelanceSettings,
  };
}