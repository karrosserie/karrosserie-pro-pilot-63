import { useState, useEffect } from 'react';
import { setImpersonationSession } from '@/services/impersonation';

export interface ImpersonationData {
  company_id: string;
  company_name: string;
  original_user: any;
}

export const useImpersonation = () => {
  const [impersonationData, setImpersonationData] = useState<ImpersonationData | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    const checkImpersonation = async () => {
      const storedData = localStorage.getItem('admin_impersonation');
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          setImpersonationData(data);
          setIsImpersonating(true);
          
          // Définir le paramètre de session Supabase
          await setImpersonationSession(data.company_id);
        } catch (error) {
          console.error('Error parsing impersonation data:', error);
          localStorage.removeItem('admin_impersonation');
          await setImpersonationSession(null);
        }
      } else {
        setImpersonationData(null);
        setIsImpersonating(false);
        await setImpersonationSession(null);
      }
    };

    checkImpersonation();
    
    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      checkImpersonation();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const exitImpersonation = async () => {
    localStorage.removeItem('admin_impersonation');
    setImpersonationData(null);
    setIsImpersonating(false);
    
    // Supprimer le paramètre de session
    await setImpersonationSession(null);
    
    // Rediriger vers la page admin
    window.location.href = '/admin/accounts';
  };

  return {
    isImpersonating,
    impersonationData,
    exitImpersonation
  };
};