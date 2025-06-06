
import React from 'react';
import { CessionFormData, CessionFormErrors } from './types';
import { RepairOrderSelector } from './components/RepairOrderSelector';
import { CessionFormFields } from './components/CessionFormFields';
import { ValidationErrorDialog } from './components/ValidationErrorDialog';

interface CessionBasicInfoSectionProps {
  formData: CessionFormData;
  errors: CessionFormErrors;
  validationErrorMessage?: string | null;
  onFieldChange: (field: keyof CessionFormData, value: any) => void;
  onClearValidationError?: () => void;
}

export const CessionBasicInfoSection = ({
  formData,
  errors,
  validationErrorMessage,
  onFieldChange,
  onClearValidationError
}: CessionBasicInfoSectionProps) => {
  return (
    <>
      <div className="space-y-4">
        {/* Ordre de réparation seul sur sa ligne */}
        <RepairOrderSelector 
          formData={formData}
          errors={errors}
          onFieldChange={onFieldChange}
        />

        <CessionFormFields 
          formData={formData}
          errors={errors}
          onFieldChange={onFieldChange}
        />
      </div>

      {/* AlertDialog pour afficher les erreurs de validation */}
      <ValidationErrorDialog 
        isOpen={!!validationErrorMessage}
        errorMessage={validationErrorMessage}
        onClose={() => onClearValidationError?.()}
      />
    </>
  );
};
