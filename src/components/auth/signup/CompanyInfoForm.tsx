import React from 'react';
import { Control } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { SignupFormValues } from './signup-schema';
import CompanyFormFields from './CompanyFormFields';

interface CompanyInfoFormProps {
  control: Control<SignupFormValues>;
  onPrevious: () => void;
  isLoading: boolean;
}

const CompanyInfoForm = ({ control, onPrevious, isLoading }: CompanyInfoFormProps) => {
  return (
    <div className="space-y-4">
      <CompanyFormFields control={control} />
      
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
          type="submit" 
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? "Inscription..." : "S'inscrire"}
        </Button>
      </div>
    </div>
  );
};

export default CompanyInfoForm;