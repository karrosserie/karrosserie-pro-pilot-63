import { supabase } from '@/integrations/supabase/client';

/**
 * Récupère l'ID de l'entreprise effective (en tenant compte de l'impersonation)
 */
export async function getCurrentUserCompanyId(): Promise<string> {
  // Vérifier d'abord s'il y a une impersonation active
  const impersonationData = localStorage.getItem('admin_impersonation');
  if (impersonationData) {
    try {
      const data = JSON.parse(impersonationData);
      return data.company_id;
    } catch (error) {
      console.error('Error parsing impersonation data:', error);
      // Nettoyer les données corrompues
      localStorage.removeItem('admin_impersonation');
    }
  }

  // Mode normal : récupérer la company_id de l'utilisateur
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_companies')
    .select('company_id')
    .eq('user_id', user.id)
    .eq('active', true)
    .single();

  if (error || !data) {
    throw new Error('No active company found for user');
  }

  return data.company_id;
}

/**
 * Service pour vérifier si l'utilisateur appartient à une entreprise
 */
export async function checkUserBelongsToCompany(companyId: string): Promise<boolean> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return false;
  }

  const { data } = await supabase
    .from('user_companies')
    .select('id')
    .eq('user_id', user.id)
    .eq('company_id', companyId)
    .eq('active', true)
    .single();

  return !!data;
}