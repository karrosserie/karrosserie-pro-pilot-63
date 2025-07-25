
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserCompanyId } from '../auth-company';

export const checkTableExists = async (): Promise<boolean> => {
  try {
    const { error } = await (supabase as any)
      .from('credits')
      .select('id')
      .limit(1);
    
    return !error || error.code !== '42P01';
  } catch (error: any) {
    return error?.code !== '42P01';
  }
};

export const ensureCreditsTableExists = async (): Promise<void> => {
  try {
    // Test if table exists by trying to query it
    const { error } = await (supabase as any)
      .from('credits')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') {
      console.log('Credits table does not exist');
      throw new Error('TABLE_MISSING');
    }
  } catch (error: any) {
    console.error('Error ensuring credits table exists:', error);
    if (error.message === 'TABLE_MISSING') {
      throw new Error('La table des avoirs n\'existe pas. Veuillez exécuter la migration SQL dans votre dashboard Supabase.');
    }
    throw error;
  }
};

export const generateReference = async (): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const companyId = await getCurrentUserCompanyId();

    // Check if table exists first
    const tableExists = await checkTableExists();
    if (!tableExists) {
      console.warn('Credits table does not exist yet, generating default reference');
      return '1';
    }

    const { data, error } = await (supabase as any)
      .from('credits')
      .select('reference')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.warn('Error fetching last reference, generating default:', error);
      return '1';
    }

    if (data && data.length > 0) {
      const lastReference = data[0].reference;
      const lastNumber = parseInt(lastReference);
      
      if (!isNaN(lastNumber)) {
        return (lastNumber + 1).toString();
      }
    }

    return '1';
  } catch (error) {
    console.error('Error generating reference:', error);
    return '1';
  }
};
