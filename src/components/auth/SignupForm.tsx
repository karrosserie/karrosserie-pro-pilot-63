
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Form,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema, SignupFormValues } from './signup/signup-schema';
import SignupFormFields from './signup/SignupFormFields';
import SignupButton from './signup/SignupButton';

interface SignupFormProps {
  onToggleMode: () => void;
}

const SignupForm = ({ onToggleMode }: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);

    try {
      await signUp(data.email, data.password, data.firstName, data.lastName, data.phoneNumber);
      // Le message de succès est maintenant géré dans useAuthState
      onToggleMode(); // Retour vers le formulaire de connexion
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
      // Les erreurs sont maintenant gérées dans useAuthState
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">
          <span className="text-karrosserie-orange">Karrosserie</span>{" "}
          <span style={{ color: 'rgb(85, 85, 85)' }}>Pro</span>
        </h1>
        <p className="text-gray-600 mt-2">Créez votre compte</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <SignupFormFields control={form.control} />
          
          <SignupButton isLoading={isLoading} />

          <div className="mt-6 text-center">
            <p>
              Déjà un compte?{" "}
              <button
                type="button"
                className="text-karrosserie-orange font-semibold"
                onClick={onToggleMode}
              >
                Se connecter
              </button>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignupForm;
