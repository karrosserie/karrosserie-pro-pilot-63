
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { companyService, CompanyInfo } from '@/services/supabase/company';
import { demoService, DEMO_MODE } from '@/services/demoService';
import { useCompanyId } from '@/hooks/use-company-id';

export function useCompany() {
  const { user } = useAuth();
  const { companyId } = useCompanyId();
  const { toast } = useToast();
  
  // En mode démo, retourner directement les données sans useEffect
  const demoCompanyData = {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Garage Dupont SARL',
    email: 'contact@garage-dupont.fr',
    address: '15 rue de la République',
    zipcode: '69003',
    city: 'Lyon',
    phone: '04.72.36.85.42',
    siren: '123456789',
    siret: '12345678900012',
    tva: 'FR12345678900',
    logo_url: '',
    notifications: {
      email: true,
      push: true,
      sms: false,
    }
  };
  
  const [companyData, setCompanyData] = useState<Partial<CompanyInfo>>(
    DEMO_MODE ? demoCompanyData : {
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
    }
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (DEMO_MODE) {
      // Pas de chargement asynchrone en mode démo
      return;
    }
    
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
