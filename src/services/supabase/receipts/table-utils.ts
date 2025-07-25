import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserCompanyId } from '../auth-company';

export const generateReference = async (): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const companyId = await getCurrentUserCompanyId();

    const { data, error } = await supabase
      .from('receipts')
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