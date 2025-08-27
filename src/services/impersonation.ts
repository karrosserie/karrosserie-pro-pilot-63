import { supabase } from '@/integrations/supabase/client';

export const setImpersonationSession = async (companyId: string | null) => {
  if (companyId) {
    // Définir le paramètre de session pour l'impersonation
    const { error } = await supabase.rpc('set_config', {
      setting_name: 'app.impersonation_company_id',
      setting_value: companyId,
      is_local: true
    });
    
    if (error) {
      console.error('Error setting impersonation session:', error);
    }
  } else {
    // Supprimer le paramètre de session
    const { error } = await supabase.rpc('set_config', {
      setting_name: 'app.impersonation_company_id',
      setting_value: '',
      is_local: true
    });
    
    if (error) {
      console.error('Error clearing impersonation session:', error);
    }
  }
};

export const getCurrentImpersonationCompanyId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('current_setting', {
      setting_name: 'app.impersonation_company_id'
    });
    
    if (error || !data) {
      return null;
    }
    
    return data && data !== '' ? data : null;
  } catch (error) {
    console.error('Error getting impersonation company id:', error);
    return null;
  }
};