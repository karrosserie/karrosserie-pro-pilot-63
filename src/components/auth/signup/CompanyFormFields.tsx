import React, { useState } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SignupFormValues } from './signup-schema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompanyFormFieldsProps {
  control: Control<SignupFormValues>;
  setValue: (name: keyof SignupFormValues, value: any) => void;
}

const legalForms = [
  "SARL", "SAS", "SASU", "EURL", "SA", "SNC", "SCS", "SCA", 
  "SEP", "SELARL", "SELASU", "SELCA", "Auto-entrepreneur", "EI", "EIRL"
];

const CompanyFormFields = ({ control, setValue }: CompanyFormFieldsProps) => {
  const [isLoadingSiren, setIsLoadingSiren] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());
  
  const sirenValue = useWatch({
    control,
    name: 'siren'
  });

  const handleSirenSearch = async (siren: string) => {
    if (siren.length !== 9) return;
    
    setIsLoadingSiren(true);
    try {
      const { data, error } = await supabase.functions.invoke('insee-sirene', {
        body: { siren }
      });

      if (error) {
        console.error('Erreur API INSEE:', error);
        toast.error('Erreur lors de la recherche des informations entreprise');
        return;
      }

      if (data.success && data.data) {
        const companyData = data.data;
        const newAutoFilledFields = new Set<string>();
        
        // Auto-remplir les champs avec les données récupérées
        if (companyData.companyName) {
          setValue('companyName', companyData.companyName);
          newAutoFilledFields.add('companyName');
        }
        if (companyData.siret) {
          setValue('siret', companyData.siret);
          newAutoFilledFields.add('siret');
        }
        if (companyData.nafCode) {
          setValue('nafCode', companyData.nafCode);
          newAutoFilledFields.add('nafCode');
        }
        if (companyData.legalForm) {
          setValue('legalForm', companyData.legalForm);
          newAutoFilledFields.add('legalForm');
        }
        
        // Remplir l'adresse, code postal et ville séparément
        if (companyData.address) {
          setValue('address', companyData.address);
          newAutoFilledFields.add('address');
        }
        if (companyData.postalCode) {
          setValue('postalCode', companyData.postalCode);
          newAutoFilledFields.add('postalCode');
        }
        if (companyData.city) {
          setValue('city', companyData.city);
          newAutoFilledFields.add('city');
        }
        
        // Créer un numéro de TVA automatique basé sur le SIREN
        if (companyData.siren && !companyData.vatNumber) {
          const tvaNumber = `FR${(12 + 3 * (parseInt(companyData.siren) % 97)) % 97}${companyData.siren}`;
          setValue('vatNumber', tvaNumber);
          newAutoFilledFields.add('vatNumber');
        }
        
        setAutoFilledFields(newAutoFilledFields);
        toast.success('Informations entreprise récupérées automatiquement');
        
        // Onboarding : SIREN validé
        const { onboardingService } = await import('@/services/onboarding/OnboardingService');
        onboardingService.updateOnboardingStep('tunnel1', 'companySirenCompleted', { siren: companyData.siren });
      } else {
        toast.error(data.error || 'Aucune information trouvée pour ce SIREN');
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel API:', error);
      toast.error('Erreur lors de la recherche des informations entreprise');
    } finally {
      setIsLoadingSiren(false);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Entreprise</h3>
          <p className="text-sm text-muted-foreground">Saisissez votre SIREN pour auto-remplir automatiquement les informations</p>
        </div>
      </div>

      <FormField
        control={control}
        name="siren"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>SIREN (9 chiffres) *</FormLabel>
            <FormControl>
            <Input 
              placeholder="123456789"
              {...field}
              onChange={(e) => {
                field.onChange(e);
                const value = e.target.value;
                if (value.length === 9 && /^\d{9}$/.test(value)) {
                  handleSirenSearch(value);
                }
              }}
              disabled={isLoadingSiren}
            />
            </FormControl>
            <p className="text-sm text-muted-foreground">
              Le SIREN sera vérifié automatiquement via l'API Sirene
            </p>
            <p className="text-sm text-red-600">
              Le SIREN doit contenir exactement 9 chiffres
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="companyName"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Raison sociale *</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Nom de votre entreprise"
                className={autoFilledFields.has('companyName') ? 'bg-green-50 border-green-200' : ''}
                {...field}
              />
            </FormControl>
            {!autoFilledFields.has('companyName') && (
              <p className="text-sm text-red-600">
                La raison sociale est requise
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="legalForm"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Forme juridique *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className={autoFilledFields.has('legalForm') ? 'bg-green-50 border-green-200' : ''}>
                  <SelectValue placeholder="Sélectionnez la forme juridique" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {legalForms.map((form) => (
                  <SelectItem key={form} value={form}>
                    {form}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!autoFilledFields.has('legalForm') && (
              <p className="text-sm text-red-600">
                La forme juridique est requise
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="siret"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>SIRET (14 chiffres) *</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="12345678901234"
                maxLength={14}
                className={autoFilledFields.has('siret') ? 'bg-green-50 border-green-200' : ''}
                {...field}
              />
            </FormControl>
            {!autoFilledFields.has('siret') && (
              <p className="text-sm text-red-600">
                Le SIRET doit contenir exactement 14 chiffres
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="vatNumber"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>N° TVA intracommunautaire *</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="FR1234567890"
                className={autoFilledFields.has('vatNumber') ? 'bg-green-50 border-green-200' : ''}
                {...field}
              />
            </FormControl>
            {!autoFilledFields.has('vatNumber') && (
              <p className="text-sm text-red-600">
                Le numéro de TVA est requis
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Adresse (rue et numéro) *</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="123 Rue de la République"
                className={autoFilledFields.has('address') ? 'bg-green-50 border-green-200' : ''}
                {...field}
              />
            </FormControl>
            {!autoFilledFields.has('address') && (
              <p className="text-sm text-red-600">
                L'adresse est requise
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="postalCode"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Code postal *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="75001"
                  maxLength={5}
                  className={autoFilledFields.has('postalCode') ? 'bg-green-50 border-green-200' : ''}
                  {...field}
                />
              </FormControl>
              {!autoFilledFields.has('postalCode') && (
                <p className="text-sm text-red-600">
                  Code postal requis
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Ville *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Paris"
                  className={autoFilledFields.has('city') ? 'bg-green-50 border-green-200' : ''}
                  {...field}
                />
              </FormControl>
              {!autoFilledFields.has('city') && (
                <p className="text-sm text-red-600">
                  Ville requise
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="nafCode"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Code NAF *</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Ex: 6201Z"
                className={autoFilledFields.has('nafCode') ? 'bg-green-50 border-green-200' : ''}
                {...field}
              />
            </FormControl>
            <p className="text-sm text-muted-foreground">
              Code d'activité principale de votre entreprise
            </p>
            {!autoFilledFields.has('nafCode') && (
              <p className="text-sm text-red-600">
                Le code NAF est requis
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanyFormFields;