import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAdmin = () => {
  const { profile } = useAuth();
  const [impersonationData, setImpersonationData] = useState<{
    company_id: string;
    company_name: string;
    original_user: any;
  } | null>(null);
  
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    const checkImpersonation = () => {
      const adminImpersonation = localStorage.getItem('admin_impersonation');
      if (adminImpersonation) {
        try {
          const data = JSON.parse(adminImpersonation);
          setImpersonationData(data);
        } catch (error) {
          console.error('Erreur lors du parsing des données d\'impersonation:', error);
          setImpersonationData(null);
        }
      } else {
        setImpersonationData(null);
      }
    };

    checkImpersonation();
    
    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_impersonation') {
        checkImpersonation();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const exitImpersonation = () => {
    localStorage.removeItem('admin_impersonation');
    setImpersonationData(null);
    // Force a page reload to reset all hooks and data
    window.location.reload();
  };
  
  return {
    isAdmin,
    impersonationData,
    isImpersonating: !!impersonationData,
    exitImpersonation
  };
};