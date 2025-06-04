
import { supabase } from '@/integrations/supabase/client';

export const checkTableExists = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
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
    const { error } = await supabase
      .from('credits')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') {
      console.log('Credits table does not exist, creating it...');
      
      // Create the table using SQL
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          -- Create credits table if it doesn't exist
          CREATE TABLE IF NOT EXISTS credits (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            reference TEXT NOT NULL,
            client_id UUID,
            vehicle_id UUID,
            invoice_id UUID,
            status TEXT NOT NULL DEFAULT 'En attente' CHECK (status IN ('En attente', 'Payé', 'Annulé')),
            amount DECIMAL(10,2) NOT NULL DEFAULT 0,
            items_data JSONB,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            
            UNIQUE(user_id, reference)
          );

          -- Enable RLS
          ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

          -- Create RLS policies
          DROP POLICY IF EXISTS "Users can view their own credits" ON credits;
          CREATE POLICY "Users can view their own credits" ON credits
            FOR SELECT USING (auth.uid() = user_id);

          DROP POLICY IF EXISTS "Users can insert their own credits" ON credits;
          CREATE POLICY "Users can insert their own credits" ON credits
            FOR INSERT WITH CHECK (auth.uid() = user_id);

          DROP POLICY IF EXISTS "Users can update their own credits" ON credits;
          CREATE POLICY "Users can update their own credits" ON credits
            FOR UPDATE USING (auth.uid() = user_id);

          DROP POLICY IF EXISTS "Users can delete their own credits" ON credits;
          CREATE POLICY "Users can delete their own credits" ON credits
            FOR DELETE USING (auth.uid() = user_id);

          -- Create indexes for better performance
          CREATE INDEX IF NOT EXISTS idx_credits_user_id ON credits(user_id);
          CREATE INDEX IF NOT EXISTS idx_credits_client_id ON credits(client_id);
          CREATE INDEX IF NOT EXISTS idx_credits_vehicle_id ON credits(vehicle_id);
          CREATE INDEX IF NOT EXISTS idx_credits_invoice_id ON credits(invoice_id);
          CREATE INDEX IF NOT EXISTS idx_credits_status ON credits(status);
          CREATE INDEX IF NOT EXISTS idx_credits_created_at ON credits(created_at);
        `
      });

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

    const { data, error } = await supabase
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
