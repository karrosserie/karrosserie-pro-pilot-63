
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import AuthContainer from '@/components/auth/AuthContainer';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();

  // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
  if (user) {
    return <Navigate to="/" replace />;
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <AuthContainer>
      {isLogin ? (
        <LoginForm onToggleMode={toggleAuthMode} />
      ) : (
        <SignupForm onToggleMode={toggleAuthMode} />
      )}
    </AuthContainer>
  );
};

export default Auth;
