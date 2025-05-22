
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthContainer from '@/components/auth/AuthContainer';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();

  // If the user is already logged in, redirect to home page
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
