
import React from 'react';
import { CessionFormData, CessionFormErrors } from './types';
import { RepairOrderSelector } from './components/RepairOrderSelector';
import { CessionFormFields } from './components/CessionFormFields';
import { ValidationErrorDialog } from './components/ValidationErrorDialog';
import { Label } from '@/components/ui/label';

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
        <div className="space-y-2">
          <Label htmlFor="repairOrderId" required>Ordre de réparation</Label>
          <RepairOrderSelector 
            value={formData.repair_order_id || ''}
            onChange={(value) => onFieldChange('repair_order_id', value)}
          />
        </div>

        <CessionFormFields 
          formData={formData}
          isViewMode={false}
          onChange={onFieldChange}
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
