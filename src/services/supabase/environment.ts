import { supabase } from '@/integrations/supabase/client';

export type Environment = {
  id: string;
  asynchronous_import: boolean;
  created_at: string;
  updated_at: string;
};

export const environmentService = {
  getSettings: async (): Promise<Environment | null> => {
    console.log('environmentService.getSettings - Starting query');
    
    const { data, error } = await supabase
      .from('environment')
      .select('*')
      .maybeSingle();

    console.log('environmentService.getSettings - Query result:');
    console.log('  - data:', data);
    console.log('  - error:', error);

    if (error) {
      console.error('Error fetching environment settings:', error);
      throw new Error(error.message);
    }

    console.log('environmentService.getSettings - Returning:', data);
    return data;
  }
};