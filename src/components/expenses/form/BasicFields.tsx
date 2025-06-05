
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Expense } from './types';

interface BasicFieldsProps {
  formData: Expense;
  onChange: (field: keyof Expense, value: any) => void;
}

export const BasicFields = ({ formData, onChange }: BasicFieldsProps) => {
  return (
    <div>
      <Label htmlFor="date" required>Date</Label>
      <Input
        id="date"
        type="date"
        value={formData.date}
        onChange={(e) => onChange('date', e.target.value)}
        required
      />
    </div>
  );
};
