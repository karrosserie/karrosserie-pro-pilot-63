
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { companyService, CompanyInfo } from '@/services/supabase/company';

export function useCompany() {
  const { user } = useAuth();
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
      if (!user) {
        return;
      }
      
      setIsLoading(true);
      
      try {
        const data = await companyService.getCompanyInfo(user.id);
        
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
  }, [user, toast]);

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
    isLoading,
    isSaving,
    updateCompanyData,
    updateNotifications,
    saveCompanyData
  };
}
