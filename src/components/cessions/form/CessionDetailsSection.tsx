
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CessionFormData, CessionFormErrors } from './types';

interface CessionDetailsSectionProps {
  formData: CessionFormData;
  errors: CessionFormErrors;
  onFieldChange: (field: keyof CessionFormData, value: any) => void;
  isReadOnly: boolean;
}

export const CessionDetailsSection = ({
  formData,
  onFieldChange,
  isReadOnly
}: CessionDetailsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Détails</h3>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => onFieldChange('notes', e.target.value)}
          placeholder="Notes supplémentaires sur la cession..."
          rows={4}
          disabled={isReadOnly}
        />
      </div>
    </div>
  );
};
