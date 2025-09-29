
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
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
  
  const { signUp } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      siren: "",
      companyName: "",
      legalForm: "",
      siret: "",
      vatNumber: "",
      address: "",
      nafCode: "",
    },
  });

  const handleNext = async () => {
    // Validate personal info fields before proceeding
    const personalFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'password', 'confirmPassword'];
    const isPersonalInfoValid = await form.trigger(personalFields as any);
    
    if (isPersonalInfoValid) {
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
    const companyFields = ['siren', 'companyName', 'legalForm', 'siret', 'vatNumber', 'address', 'nafCode'];
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
        nafCode: data.nafCode,
      };
      
      await signUp(
        data.email, 
        data.password, 
        data.firstName, 
        data.lastName, 
        data.phoneNumber,
        false, // isTeamMember
        companyData
      );
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
