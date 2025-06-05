
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Expense } from './types';

interface DescriptionFieldProps {
  formData: Expense;
  onChange: (field: keyof Expense, value: any) => void;
}

export const DescriptionField = ({ formData, onChange }: DescriptionFieldProps) => {
  return (
    <div>
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={formData.description}
        onChange={(e) => onChange('description', e.target.value)}
        placeholder="Description détaillée de la dépense"
        rows={3}
      />
    </div>
  );
};
