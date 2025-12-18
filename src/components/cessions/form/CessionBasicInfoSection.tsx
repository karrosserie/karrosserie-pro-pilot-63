
import React from 'react';
import { CessionFormData, CessionFormErrors } from './types';
import { CessionTypeSelector } from './components/CessionTypeSelector';
import { RepairOrderSelector } from './components/RepairOrderSelector';
import { FleetReservationSelector } from './components/FleetReservationSelector';
import { CessionFormFields } from './components/CessionFormFields';
import { ValidationErrorDialog } from './components/ValidationErrorDialog';

interface CessionBasicInfoSectionProps {
  formData: CessionFormData;
  errors: CessionFormErrors;
  validationErrorMessage?: string | null;
  client?: any;
  companyId?: string;
  onFieldChange: (field: keyof CessionFormData, value: any) => void;
  onClearValidationError?: () => void;
  isEditing?: boolean;
}

export const CessionBasicInfoSection = ({
  formData,
  errors,
  validationErrorMessage,
  client,
  companyId,
  onFieldChange,
  onClearValidationError,
  isEditing = false
}: CessionBasicInfoSectionProps) => {
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.debug('[CessionBasicInfoSection]', {
        cession_type: formData.cession_type,
        isEditing,
      });
    }
  }, [formData.cession_type, isEditing]);

  return (
    <>
      <div className="space-y-4">
        {/* Type de cession - disabled if editing */}
        <CessionTypeSelector
          value={formData.cession_type}
          onChange={(value) => onFieldChange('cession_type', value)}
          disabled={isEditing}
        />

        {/* Sélecteur basé sur le type */}
        {formData.cession_type === 'repair' ? (
          <RepairOrderSelector 
            formData={formData}
            errors={errors}
            onFieldChange={onFieldChange}
          />
        ) : (
          <FleetReservationSelector 
            formData={formData}
            errors={errors}
            onFieldChange={onFieldChange}
          />
        )}

        <CessionFormFields 
          formData={formData}
          errors={errors}
          onFieldChange={onFieldChange}
          cessionType={formData.cession_type}
        />
      </div>

      {/* AlertDialog pour afficher les erreurs de validation */}
      <ValidationErrorDialog 
        isOpen={!!validationErrorMessage}
        errorMessage={validationErrorMessage}
        client={client}
        companyId={companyId}
        onClose={() => onClearValidationError?.()}
      />
    </>
  );
};

