
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, ArrowLeft } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const forgotPasswordSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { resetPassword } = useAuth();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);

    try {
      await resetPassword(data.email);
      setEmailSent(true);
    } catch (error: any) {
      console.error("Erreur de réinitialisation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-karrosserie-orange">Email envoyé</h1>
          <p className="text-gray-600 mt-2">
            Un email de réinitialisation a été envoyé à votre adresse email.
          </p>
        </div>

        <div className="text-center space-y-4">
          <Mail className="h-16 w-16 text-karrosserie-orange mx-auto" />
          <p className="text-gray-600">
            Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.
          </p>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onBackToLogin}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la connexion
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-karrosserie-orange">Mot de passe oublié</h1>
        <p className="text-gray-600 mt-2">
          Entrez votre adresse email pour recevoir un lien de réinitialisation
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Envoi en cours...
              </span>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Envoyer le lien de réinitialisation
              </>
            )}
          </Button>

          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-karrosserie-orange font-semibold"
              onClick={onBackToLogin}
            >
              <ArrowLeft className="h-4 w-4 inline mr-1" />
              Retour à la connexion
            </button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ForgotPasswordForm;
