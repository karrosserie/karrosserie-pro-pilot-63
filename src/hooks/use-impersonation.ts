import { useState, useEffect } from 'react';

export interface ImpersonationData {
  company_id: string;
  company_name: string;
  original_user: any;
}

export const useImpersonation = () => {
  const [impersonationData, setImpersonationData] = useState<ImpersonationData | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    const checkImpersonation = () => {
      const storedData = localStorage.getItem('admin_impersonation');
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          setImpersonationData(data);
          setIsImpersonating(true);
        } catch (error) {
          console.error('Error parsing impersonation data:', error);
          localStorage.removeItem('admin_impersonation');
        }
      } else {
        setImpersonationData(null);
        setIsImpersonating(false);
      }
    };

    checkImpersonation();
    
    // Écouter les changements dans localStorage
    window.addEventListener('storage', checkImpersonation);
    
    return () => {
      window.removeEventListener('storage', checkImpersonation);
    };
  }, []);

  const exitImpersonation = () => {
    localStorage.removeItem('admin_impersonation');
    setImpersonationData(null);
    setIsImpersonating(false);
    // Rediriger vers la page admin
    window.location.href = '/admin/accounts';
  };

  return {
    isImpersonating,
    impersonationData,
    exitImpersonation
  };
};