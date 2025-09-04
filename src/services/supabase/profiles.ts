import { STATIC_PROFILES, mockApiDelay } from '@/data/staticData';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  phone?: string;
  email?: string;
  company_id?: string;
  is_admin?: boolean;
  [key: string]: any;
}

// Variable pour stocker les profils modifiés
let profilesData = [...STATIC_PROFILES];

export const profileService = {
  /**
   * Get a user profile by ID
   */
  getProfileById: async (userId: string): Promise<Profile | null> => {
    console.log('Getting profile for user:', userId);
    await mockApiDelay(200);
    
    const profile = profilesData.find(p => p.id === userId);
    
    if (!profile) {
      console.error('Profile not found for user:', userId);
      return null;
    }
    
    console.log('Profile found:', profile);
    return profile;
  },

  /**
   * Update a user profile
   */
  updateProfile: async (userId: string, profileData: Partial<Profile>) => {
    console.log('Updating profile for user:', userId, 'with data:', profileData);
    await mockApiDelay(500);
    
    const profileIndex = profilesData.findIndex(p => p.id === userId);
    
    if (profileIndex === -1) {
      throw new Error(`Profile not found for user: ${userId}`);
    }
    
    const updatedProfile = {
      ...profilesData[profileIndex],
      ...profileData,
      updated_at: new Date().toISOString(),
    };
    
    profilesData[profileIndex] = updatedProfile;
    
    console.log('Profile updated:', updatedProfile);
    return updatedProfile;
  },
};
