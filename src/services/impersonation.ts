import { mockApiDelay } from '@/data/staticData';

export const setImpersonationSession = async (companyId: string | null) => {
  try {
    console.log('Setting impersonation session for company:', companyId);
    await mockApiDelay(100);
    
    if (companyId) {
      // Stocker l'impersonation dans localStorage
      localStorage.setItem('admin_impersonation', JSON.stringify({
        company_id: companyId,
        timestamp: Date.now()
      }));
      console.log('Impersonation session set successfully');
    } else {
      // Supprimer l'impersonation
      localStorage.removeItem('admin_impersonation');
      console.log('Impersonation session cleared successfully');
    }
  } catch (error) {
    console.error('Error managing impersonation session:', error);
  }
};

export const getCurrentImpersonationCompanyId = async (): Promise<string | null> => {
  try {
    await mockApiDelay(50);
    
    const impersonationData = localStorage.getItem('admin_impersonation');
    if (!impersonationData) {
      return null;
    }
    
    const data = JSON.parse(impersonationData);
    return data.company_id || null;
  } catch (error) {
    console.error('Error getting impersonation company id:', error);
    // Nettoyer les données corrompues
    localStorage.removeItem('admin_impersonation');
    return null;
  }
};