
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CustomPhoneInput } from '@/components/ui/custom-phone-input';
import { Profile } from '@/services/supabase/profiles';

const profileSchema = z.object({
  first_name: z.string().min(1, { message: "Le prénom est requis" }),
  last_name: z.string().min(1, { message: "Le nom est requis" }),
  phone_number: z.string().min(1, { message: "Le numéro de téléphone est requis" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface PersonalInfoFormProps {
  profile: Profile | null;
  onSubmit: (data: Partial<Profile>) => Promise<void>;
  onCancel: () => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
  profile, 
  onSubmit, 
  onCancel 
}) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone_number: profile?.phone_number || '',
    },
    mode: 'onChange',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Prénom <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Prénom" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Nom <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nom" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Numéro de téléphone <span className="text-red-500">*</span>
              </FormLabel>
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
        
        <div className="flex gap-2 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
          >
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
};
