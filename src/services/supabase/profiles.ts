
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  [key: string]: any;
}

export const profileService = {
  /**
   * Get a user profile by ID
   */
  getProfileById: async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  },

  /**
   * Update a user profile
   */
  updateProfile: async (userId: string, profileData: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  },
};
