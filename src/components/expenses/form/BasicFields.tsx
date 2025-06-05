
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
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="reference" required>Référence</Label>
        <Input
          id="reference"
          value={formData.reference}
          onChange={(e) => onChange('reference', e.target.value)}
          placeholder="DEP2024-001"
          required
        />
      </div>
      
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
    </div>
  );
};
