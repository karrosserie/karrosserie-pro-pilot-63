import React from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { SignupFormValues } from './signup-schema';
import CompanyFormFields from './CompanyFormFields';

interface CompanyInfoFormProps {
  control: Control<SignupFormValues>;
  onPrevious: () => void;
  onNext: () => void;
  isLoading: boolean;
  setValue: UseFormSetValue<SignupFormValues>;
}

const CompanyInfoForm = ({ control, onPrevious, onNext, isLoading, setValue }: CompanyInfoFormProps) => {
  return (
    <div className="space-y-4">
      <CompanyFormFields control={control} setValue={setValue} />
      
      <div className="flex gap-4 pt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
          className="flex-1"
        >
          Précédent
        </Button>
        <Button 
          type="button" 
          onClick={onNext}
          disabled={isLoading}
          className="flex-1"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default CompanyInfoForm;