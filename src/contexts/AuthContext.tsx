
import React, { createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/use-auth-state';
import { Profile } from '@/services/supabase/profiles';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ session: Session; user: User; }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, phoneNumber: string) => Promise<{ user: User; session: Session; }>;
  signOut: () => Promise<void>;
  resendEmailVerification: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfileState: (newProfile: Profile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo mode configuration
const DEMO_MODE = true;

const demoUser: User = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'demo@karrosserie-pro.fr',
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
} as User;

const demoProfile: Profile = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'demo@karrosserie-pro.fr',
  first_name: 'Jean',
  last_name: 'Dupont',
  phone: '01.23.45.67.89',
  company_id: '00000000-0000-4000-8000-000000000002',
  role: 'admin',
  created_at: new Date(new Date().getFullYear(), 0, 1).toISOString(), // Compte créé en début d'année
  updated_at: new Date().toISOString(),
};

const demoSession: Session = {
  access_token: 'demo-access-token',
  refresh_token: 'demo-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() / 1000 + 3600,
  token_type: 'Bearer',
  user: demoUser,
} as Session;

const demoAuthContextValue: AuthContextType = {
  session: demoSession,
  user: demoUser,
  profile: demoProfile,
  loading: false,
  signIn: async () => ({ session: demoSession, user: demoUser }),
  signUp: async () => ({ user: demoUser, session: demoSession }),
  signOut: async () => {},
  resendEmailVerification: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
  updateProfileState: () => {},
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  if (DEMO_MODE) {
    return <AuthContext.Provider value={demoAuthContextValue}>{children}</AuthContext.Provider>;
  }
  
  const auth = useAuthState();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
