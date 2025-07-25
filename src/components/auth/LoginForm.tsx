
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Form,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import EmailVerificationAlert from './login/EmailVerificationAlert';
import LoginFormFields from './login/LoginFormFields';
import LoginButton from './login/LoginButton';
import { loginSchema, LoginFormValues } from './login/login-schema';

interface LoginFormProps {
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

const LoginForm = ({ onToggleMode, onForgotPassword }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationNeeded, setEmailVerificationNeeded] = useState<string | null>(null);
  
  const { signIn, resendEmailVerification } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setEmailVerificationNeeded(null);

    try {
      await signIn(data.email, data.password);
      // Le succès est géré dans useAuthState
    } catch (error: any) {
      // Vérifier si l'erreur est liée à une adresse email non vérifiée
      if (error.message?.includes('Email not confirmed') || 
          error.message?.includes('Email pas encore confirmée') ||
          error.name === 'EmailNotConfirmed') {
        setEmailVerificationNeeded(data.email);
      }
      console.error("Erreur de connexion:", error);
      // Les autres erreurs sont gérées dans useAuthState
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!emailVerificationNeeded) return;
    
    try {
      await resendEmailVerification(emailVerificationNeeded);
      // Le message de succès est géré dans useAuthState
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      // Les erreurs sont gérées dans useAuthState
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">
          <span className="text-karrosserie-orange">Karrosserie</span>{" "}
          <span style={{ color: 'rgb(85, 85, 85)' }}>Pro</span>
        </h1>
        <p className="text-gray-600 mt-2">Connectez-vous à votre compte</p>
      </div>

      {emailVerificationNeeded && (
        <EmailVerificationAlert
          email={emailVerificationNeeded}
          onResendVerification={handleResendVerification}
        />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <LoginFormFields form={form} onForgotPassword={onForgotPassword} />

          <LoginButton isLoading={isLoading} />

          <div className="mt-6 text-center">
            <p>
              Pas encore de compte?{" "}
              <button
                type="button"
                className="text-karrosserie-orange font-semibold"
                onClick={onToggleMode}
              >
                S'inscrire
              </button>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
