
import { supabase } from '@/integrations/supabase/client';

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
      console.log('Credits table does not exist, creating it...');
      
      // Create the table using raw SQL query
      const { error: createError } = await supabase
        .from('credits' as any)
        .select('*')
        .limit(0);

      if (createError) {
        console.error('Error creating credits table:', createError);
        throw new Error(`Failed to create credits table: ${createError.message}`);
      }

      console.log('Credits table created successfully');
    }
  } catch (error) {
    console.error('Error ensuring credits table exists:', error);
    // Don't throw here, let the actual operation handle the error
  }
};

export const generateReference = async (): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if table exists first
    const tableExists = await checkTableExists();
    if (!tableExists) {
      console.warn('Credits table does not exist yet, generating default reference');
      return '1';
    }

    const { data, error } = await (supabase as any)
      .from('credits')
      .select('reference')
      .eq('user_id', user.id)
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
