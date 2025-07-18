
import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CustomPhoneInput } from '@/components/ui/custom-phone-input';
import { SignupFormValues } from './signup-schema';

interface SignupFormFieldsProps {
  control: Control<SignupFormValues>;
}

const SignupFormFields = ({ control }: SignupFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Jean"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Dupont"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
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
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Numéro de téléphone</FormLabel>
            <FormControl>
              <CustomPhoneInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Numéro de téléphone"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Mot de passe</FormLabel>
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

      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Confirmer le mot de passe</FormLabel>
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

export default SignupFormFields;
