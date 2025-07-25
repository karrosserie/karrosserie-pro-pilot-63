import { supabase } from '@/integrations/supabase/client';

/**
 * Service pour récupérer le company_id de l'utilisateur connecté
 */
export async function getCurrentUserCompanyId(): Promise<string> {
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