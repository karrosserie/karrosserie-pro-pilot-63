import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/hooks/use-company';
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
        // Données fictives pour les préférences de l'entreprise
        const mockPreferences = {
          id: 'pref-1',
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
          next_repair_order_ref: '1001',
          next_invoice_ref: '2001',
          next_credit_ref: '3001',
          ai_relance_enabled: true,
          payment_details: 'Paiement à 30 jours net',
          invoice_non_engagement_clause: 'Les pièces restent la propriété de Karrosserie Pro jusqu\'au paiement intégral',
          repair_order_non_engagement_clause: 'Devis valable 30 jours. Travaux effectués selon les règles de l\'art',
          payment_conditions: 'Paiement à réception de facture - 30 jours net',
          late_payment_penalties: 'Pénalités de retard: 3 fois le taux légal + 40€ de frais de recouvrement',
          company_details: 'Spécialiste en carrosserie automobile depuis 1985',
        };

        setPreferences(mockPreferences);
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
      // Simuler la mise à jour sans appel Supabase
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

  return {
    preferences,
    isLoading,
    updateAiRelanceStatus,
  };
}