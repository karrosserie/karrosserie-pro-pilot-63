
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
    // Initialize auth state
    const initializeAuth = async () => {
      setLoading(true);
      
      // Get initial session
      const initialSession = await authService.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        await fetchProfile(initialSession.user.id);
      }
      
      // Set up auth state change listener
      const subscription = authService.onAuthStateChange((currentSession, currentUser) => {
        setSession(currentSession);
        setUser(currentUser);
        
        if (currentUser) {
          fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
      });
      
      setLoading(false);
      
      // Cleanup subscription
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  return {
    session,
    user,
    profile,
    loading,
    setLoading,
  };
};
