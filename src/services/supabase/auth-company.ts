import { STATIC_USER_COMPANIES, mockApiDelay } from '@/data/staticData';

/**
 * Récupère l'ID de l'entreprise effective (en tenant compte de l'impersonation)
 */
export async function getCurrentUserCompanyId(): Promise<string> {
  // Vérifier d'abord s'il y a une impersonation active
  const impersonationData = localStorage.getItem('admin_impersonation');
  if (impersonationData) {
    try {
      const data = JSON.parse(impersonationData);
      console.log('Using impersonation company_id:', data.company_id);
      return data.company_id;
    } catch (error) {
      console.error('Error parsing impersonation data:', error);
      // Nettoyer les données corrompues
      localStorage.removeItem('admin_impersonation');
    }
  }

  // Mode normal : récupérer la company_id de l'utilisateur
  await mockApiDelay(100);
  
  // Pour la démo, retourner directement l'ID de l'entreprise par défaut
  const userCompany = STATIC_USER_COMPANIES.find(uc => uc.user_id === 'demo-user-123' && uc.active);
  
  if (!userCompany) {
    throw new Error('No active company found for user');
  }

  console.log('Using company_id:', userCompany.company_id);
  return userCompany.company_id;
}

/**
 * Service pour vérifier si l'utilisateur appartient à une entreprise
 */
export async function checkUserBelongsToCompany(companyId: string): Promise<boolean> {
  await mockApiDelay(100);
  
  // Pour la démo, l'utilisateur appartient toujours à l'entreprise demo-company-123
  const userCompany = STATIC_USER_COMPANIES.find(
    uc => uc.user_id === 'demo-user-123' && uc.company_id === companyId && uc.active
  );

  return !!userCompany;
}