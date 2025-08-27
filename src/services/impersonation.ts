import { supabase } from '@/integrations/supabase/client';

export const setImpersonationSession = async (companyId: string | null) => {
  try {
    console.log('Setting impersonation session for company:', companyId);
    
    if (companyId) {
      // Définir le paramètre de session pour l'impersonation
      const { error } = await supabase.rpc('set_config' as any, {
        setting_name: 'app.impersonation_company_id',
        setting_value: companyId,
        is_local: true
      });
      
      if (error) {
        console.error('Error setting impersonation session:', error);
      } else {
        console.log('Impersonation session set successfully');
      }
    } else {
      // Supprimer le paramètre de session
      const { error } = await supabase.rpc('set_config' as any, {
        setting_name: 'app.impersonation_company_id',
        setting_value: '',
        is_local: true
      });
      
      if (error) {
        console.error('Error clearing impersonation session:', error);
      } else {
        console.log('Impersonation session cleared successfully');
      }
    }
  } catch (error) {
    console.error('Error managing impersonation session:', error);
  }
};

export const getCurrentImpersonationCompanyId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('current_setting' as any, {
      setting_name: 'app.impersonation_company_id'
    });
    
    if (error || !data) {
      return null;
    }
    
    // Assurer que nous avons une chaîne de caractères
    const result = typeof data === 'string' ? data : String(data);
    return result && result !== '' ? result : null;
  } catch (error) {
    console.error('Error getting impersonation company id:', error);
    return null;
  }
};