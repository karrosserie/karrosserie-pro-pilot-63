import { useAuth } from '@/contexts/AuthContext';

export const useAdmin = () => {
  const { profile } = useAuth();
  
  const isAdmin = profile?.role === 'admin';
  
  return {
    isAdmin
  };
};