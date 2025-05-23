
import { useAuthSession } from './auth/use-auth-session';
import { useAuthActions } from './auth/use-auth-actions';
import { useAuthUtilities } from './auth/use-auth-utilities';

export const useAuthState = () => {
  const { session, user, profile, loading, setLoading } = useAuthSession();
  const { signIn, signUp, signOut } = useAuthActions(setLoading);
  const { resendEmailVerification, resetPassword, updatePassword } = useAuthUtilities(setLoading);

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
  };
};
