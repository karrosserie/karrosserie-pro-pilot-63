
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
        console.log('No user found, skipping company data load');
        return;
      }
      
      setIsLoading(true);
      console.log('Loading company data for user:', user.id);
      
      try {
        const data = await companyService.getCompanyInfo(user.id);
        console.log('Received company data from service:', data);
        
        if (data) {
          // Mettre à jour avec les données de la base
          console.log('Setting company data:', data);
          setCompanyData(data);
        } else {
          console.log('No company data found, keeping default values');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
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
    if (!user) return;

    setIsSaving(true);
    try {
      console.log('Saving company data:', companyData);
      const updatedData = await companyService.updateCompanyInfo(user.id, companyData);
      console.log('Received updated data:', updatedData);
      setCompanyData(updatedData);
      toast({
        title: "Données sauvegardées",
        description: "Les informations de votre entreprise ont été mises à jour.",
      });
      return updatedData;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
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
    console.log('Updating company data with:', updates);
    setCompanyData(prev => {
      const newData = { ...prev, ...updates };
      console.log('New company data state:', newData);
      return newData;
    });
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

  console.log('useCompany hook state:', { companyData, isLoading, isSaving });

  return {
    companyData,
    isLoading,
    isSaving,
    updateCompanyData,
    updateNotifications,
    saveCompanyData
  };
}
