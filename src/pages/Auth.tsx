
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthContainer from '@/components/auth/AuthContainer';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { toast } from '@/hooks/use-toast';

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password';

const Auth = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Déterminer le mode basé sur l'URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/auth/reset-password')) {
      setAuthMode('reset-password');
    } else {
      setAuthMode('login');
    }
  }, []);

  // Vérifiez les paramètres d'URL pour les messages de redirection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    const error = params.get('error');
    
    if (message) {
      toast({
        title: 'Information',
        description: message,
      });
    }
    
    if (error) {
      toast({
        title: 'Erreur',
        description: error,
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    // Si l'utilisateur est connecté, redirigez-le selon son rôle
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
  if (user) {
    return <Navigate to="/" replace />;
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  const showForgotPassword = () => {
    setAuthMode('forgot-password');
  };

  const showLogin = () => {
    setAuthMode('login');
  };

  const renderAuthForm = () => {
    switch (authMode) {
      case 'login':
        return <LoginForm onToggleMode={toggleAuthMode} onForgotPassword={showForgotPassword} />;
      case 'signup':
        return <SignupForm onToggleMode={toggleAuthMode} />;
      case 'forgot-password':
        return <ForgotPasswordForm onBackToLogin={showLogin} />;
      case 'reset-password':
        return <ResetPasswordForm />;
      default:
        return <LoginForm onToggleMode={toggleAuthMode} onForgotPassword={showForgotPassword} />;
    }
  };

  return (
    <AuthContainer>
      {renderAuthForm()}
    </AuthContainer>
  );
};

export default Auth;
