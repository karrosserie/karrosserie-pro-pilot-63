
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginFormValues } from './login-schema';

interface LoginFormFieldsProps {
  form: UseFormReturn<LoginFormValues>;
  onForgotPassword: () => void;
}

const LoginFormFields = ({ form, onForgotPassword }: LoginFormFieldsProps) => {
  return (
    <>
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

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <div className="flex justify-between">
              <FormLabel>Mot de passe</FormLabel>
              <button 
                type="button"
                className="text-sm text-karrosserie-orange hover:underline"
                onClick={onForgotPassword}
              >
                Mot de passe oublié?
              </button>
            </div>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default LoginFormFields;
