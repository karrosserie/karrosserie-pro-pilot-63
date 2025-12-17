import { useState, useEffect, useRef } from 'react';
import { setImpersonationSession } from '@/services/impersonation';

export interface ImpersonationData {
  company_id: string;
  company_name: string;
  original_user: any;
}

// Variable globale pour tracker si la session a déjà été initialisée
let sessionInitialized = false;
let lastCompanyId: string | null = null;

export const useImpersonation = () => {
  const [impersonationData, setImpersonationData] = useState<ImpersonationData | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    const checkImpersonation = async () => {
      const storedData = localStorage.getItem('admin_impersonation');
      
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          setImpersonationData(data);
          setIsImpersonating(true);
          
          // Ne définir la session que si le company_id a changé
          if (lastCompanyId !== data.company_id) {
            lastCompanyId = data.company_id;
            await setImpersonationSession(data.company_id);
          }
        } catch (error) {
          console.error('Error parsing impersonation data:', error);
          localStorage.removeItem('admin_impersonation');
          if (lastCompanyId !== null) {
            lastCompanyId = null;
            await setImpersonationSession(null);
          }
        }
      } else {
        // Ne mettre à jour l'état que si nécessaire
        setImpersonationData(prev => prev === null ? prev : null);
        setIsImpersonating(prev => prev === false ? prev : false);
        
        // Ne clear la session qu'une seule fois au premier mount (si pas d'impersonation)
        if (!sessionInitialized) {
          sessionInitialized = true;
          lastCompanyId = null;
          await setImpersonationSession(null);
        }
      }
      
      hasInitializedRef.current = true;
    };

    // Ne vérifier qu'une fois par instance de hook
    if (!hasInitializedRef.current) {
      checkImpersonation();
    }
    
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