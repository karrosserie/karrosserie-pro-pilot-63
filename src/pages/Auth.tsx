
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthContainer from '@/components/auth/AuthContainer';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
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
    // Si l'utilisateur est connecté, redirigez-le vers la page d'accueil
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
