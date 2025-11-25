
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Form,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema, SignupFormValues } from './signup/signup-schema';
import PersonalInfoForm from './signup/PersonalInfoForm';
import CompanyInfoForm from './signup/CompanyInfoForm';
import AddressConfirmation from './signup/AddressConfirmation';

interface SignupFormProps {
  onToggleMode: () => void;
}

const SignupForm = ({ onToggleMode }: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'personal' | 'company' | 'confirm'>('personal');
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const { signUp } = useAuth();

  // Lire les paramètres URL pour pré-remplir les champs
  const urlFirstName = searchParams.get("firstName") || "";
  const urlLastName = searchParams.get("lastName") || "";
  const urlEmail = searchParams.get("email") || "";
  const urlPhoneNumber = searchParams.get("phoneNumber") || "";

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: urlFirstName,
      lastName: urlLastName,
      email: urlEmail,
      phoneNumber: urlPhoneNumber,
      password: "",
      confirmPassword: "",
      siren: "",
      companyName: "",
      legalForm: "",
      siret: "",
      vatNumber: "",
      address: "",
      city: "",
      zipcode: "",
      nafCode: "",
    },
  });

  // Mettre à jour les valeurs si les paramètres URL changent
  useEffect(() => {
    if (urlFirstName) form.setValue("firstName", urlFirstName);
    if (urlLastName) form.setValue("lastName", urlLastName);
    if (urlEmail) form.setValue("email", urlEmail);
    if (urlPhoneNumber) form.setValue("phoneNumber", urlPhoneNumber);
  }, [urlFirstName, urlLastName, urlEmail, urlPhoneNumber, form]);

  const handleNext = async () => {
    // Validate personal info fields before proceeding
    const personalFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'password', 'confirmPassword'];
    const isPersonalInfoValid = await form.trigger(personalFields as any);
    
    if (isPersonalInfoValid) {
      // Valider le numéro de téléphone avec Numverify
      const phoneNumber = form.getValues('phoneNumber');
      
      try {
        const { data, error } = await supabase.functions.invoke('validate-phone-number', {
          body: { phoneNumber }
        });

        if (error) {
          console.error('Erreur lors de la validation du numéro:', error);
        } else if (data && !data.valid) {
          // Afficher un toast d'avertissement si le numéro n'est pas attribué
          const reason = !data.details?.hasCarrier 
            ? "Ce numéro n'est pas attribué à un opérateur" 
            : "Ce numéro de téléphone n'est pas valide";
          
          toast({
            title: "Numéro de téléphone non attribué",
            description: reason,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Erreur lors de la validation du numéro:', error);
        // Ne pas bloquer l'inscription en cas d'erreur de validation
      }
      
      setCurrentStep('company');
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'confirm') {
      setCurrentStep('company');
    } else {
      setCurrentStep('personal');
    }
  };

  const handleCompanyNext = async () => {
    // Validate company info fields before proceeding
    const companyFields = ['siren', 'companyName', 'legalForm', 'siret', 'vatNumber', 'address', 'city', 'zipcode', 'nafCode'];
    const isCompanyInfoValid = await form.trigger(companyFields as any);
    
    if (isCompanyInfoValid) {
      setCurrentStep('confirm');
    }
  };

  const isPersonalInfoValid = () => {
    const { firstName, lastName, email, phoneNumber, password, confirmPassword } = form.getValues();
    const { errors } = form.formState;
    
    return firstName && lastName && email && phoneNumber && password && confirmPassword &&
           !errors.firstName && !errors.lastName && !errors.email && 
           !errors.phoneNumber && !errors.password && !errors.confirmPassword;
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);

    try {
      const companyData = {
        siren: data.siren,
        companyName: data.companyName,
        legalForm: data.legalForm,
        siret: data.siret,
        vatNumber: data.vatNumber,
        address: data.address,
        city: data.city,
        zipcode: data.zipcode,
        nafCode: data.nafCode,
      };
      
      const { user } = await signUp(
        data.email, 
        data.password, 
        data.firstName, 
        data.lastName, 
        data.phoneNumber,
        false, // isTeamMember
        companyData
      );
      
      // Initialiser et compléter l'onboarding : profil complété
      if (user) {
        const { onboardingService } = await import('@/services/onboarding/OnboardingService');
        onboardingService.initOnboardingState(user.id);
        onboardingService.updateOnboardingStep('tunnel1', 'profileCompleted', { userId: user.id });
      }
      
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
        <p className="text-gray-600 mt-2">
          {currentStep === 'personal' && 'Créez votre compte'}
          {currentStep === 'company' && 'Informations de votre entreprise'}
          {currentStep === 'confirm' && 'Confirmation des informations'}
        </p>
        {/* Progress indicator */}
        <div className="flex items-center justify-center mt-4 space-x-2">
          <div className={`w-3 h-3 rounded-full ${currentStep === 'personal' ? 'bg-karrosserie-orange' : 'bg-gray-300'}`} />
          <div className="w-8 h-px bg-gray-300" />
          <div className={`w-3 h-3 rounded-full ${currentStep === 'company' ? 'bg-karrosserie-orange' : 'bg-gray-300'}`} />
          <div className="w-8 h-px bg-gray-300" />
          <div className={`w-3 h-3 rounded-full ${currentStep === 'confirm' ? 'bg-karrosserie-orange' : 'bg-gray-300'}`} />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {currentStep === 'personal' && (
            <PersonalInfoForm 
              control={form.control}
              onNext={handleNext}
              isValid={isPersonalInfoValid()}
            />
          )}
          
          {currentStep === 'company' && (
            <CompanyInfoForm 
              control={form.control}
              onPrevious={handlePrevious}
              onNext={handleCompanyNext}
              isLoading={isLoading}
              setValue={form.setValue}
            />
          )}
          
          {currentStep === 'confirm' && (
            <AddressConfirmation
              companyName={form.getValues('companyName')}
              address={form.getValues('address')}
              onConfirm={() => form.handleSubmit(onSubmit)()}
              onBack={handlePrevious}
              isLoading={isLoading}
            />
          )}

          {currentStep === 'personal' && (
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
          )}
        </form>
      </Form>
    </>
  );
};

export default SignupForm;
