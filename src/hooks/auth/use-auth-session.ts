
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { authService } from '@/services/supabase/auth';
import { profileService, Profile } from '@/services/supabase/profiles';

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const profileData = await profileService.getProfileById(userId);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Initialize auth state with error handling
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get initial session
        const initialSession = await authService.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await fetchProfile(initialSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Set default values on error to prevent app crash
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  return {
    session,
    user,
    profile,
    loading,
    setLoading,
    setProfile,
  };
};
