
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { companyService, CompanyInfo } from '@/services/supabase/company';
import { useImpersonation } from '@/hooks/use-impersonation';

export function useCompany() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isImpersonating, impersonationData } = useImpersonation();
  const [companyData, setCompanyData] = useState<Partial<CompanyInfo>>({
    name: '',
    email: '',
    address: '',
    zipcode: '',
    city: '',
    phone: '',
    siren: '',
    siret: '',
    tva: '',
    logo_url: '',
    notifications: {
      email: true,
      push: true,
      sms: false,
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadCompanyData = async () => {
      if (!user) {
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Le service companyService gère automatiquement l'impersonation
        const data = await companyService.getCompanyInfo();
        
        if (data) {
          setCompanyData(data);
        }
      } catch (error) {
        console.error('useCompany: Erreur lors du chargement des données:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'entreprise.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyData();
  }, [user?.id, isImpersonating, impersonationData?.company_id]);

  const reloadCompanyData = async () => {
    if (!user) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Forcer le rechargement des données depuis la base de données
      const data = await companyService.getCompanyInfo();
      
      if (data) {
        setCompanyData(data);
      }
    } catch (error) {
      console.error('useCompany: Erreur lors du rechargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de recharger les données de l'entreprise.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveCompanyData = async () => {
    if (!user) {
      return;
    }

    setIsSaving(true);
    try {
      // Le service companyService gère automatiquement l'impersonation
      const updatedData = await companyService.updateCompanyInfo(undefined, companyData);
      
      setCompanyData(updatedData);
      toast({
        title: "Données sauvegardées",
        description: "Les informations de votre entreprise ont été mises à jour.",
      });
      return updatedData;
    } catch (error) {
      console.error('useCompany: Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les données.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const updateCompanyData = (updates: Partial<CompanyInfo>) => {
    setCompanyData(prev => ({ ...prev, ...updates }));
  };

  const updateNotifications = (key: string) => {
    setCompanyData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications?.[key]
      }
    }));
  };

  return {
    companyData,
    companyInfo: companyData, // Add alias for backward compatibility
    isLoading,
    isSaving,
    updateCompanyData,
    updateNotifications,
    saveCompanyData,
    reloadCompanyData
  };
}
