
import { useAuthSession } from './auth/use-auth-session';
import { useAuthActions } from './auth/use-auth-actions';
import { useAuthUtilities } from './auth/use-auth-utilities';
import { Profile } from '@/services/supabase/profiles';

export const useAuthState = () => {
  const { session, user, profile, loading, setLoading, setProfile } = useAuthSession();
  const { signIn, signUp, signOut } = useAuthActions(setLoading);
  const { resendEmailVerification, resetPassword, updatePassword } = useAuthUtilities(setLoading);
  
  const updateProfileState = (newProfile: Profile) => {
    setProfile(newProfile);
  };

  return {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resendEmailVerification,
    resetPassword,
    updatePassword,
    updateProfileState,
  };
};
