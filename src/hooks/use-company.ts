
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { companyService, CompanyInfo } from '@/services/supabase/company';
import { useCompanyId } from '@/hooks/use-company-id';

export function useCompany() {
  const { user } = useAuth();
  const { companyId } = useCompanyId();
  const { toast } = useToast();
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
      if (!user || !companyId) {
        return;
      }
      
      setIsLoading(true);
      
      try {
        const data = await companyService.getCompanyInfoById(companyId);
        
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
  }, [user?.id, companyId]);

  const saveCompanyData = async () => {
    if (!user) {
      return;
    }

    setIsSaving(true);
    try {
      const updatedData = await companyService.updateCompanyInfo(user.id, companyData);
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
    saveCompanyData
  };
}
