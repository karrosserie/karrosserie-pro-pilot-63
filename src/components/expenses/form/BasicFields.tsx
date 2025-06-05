
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
    <div className="grid grid-cols-3 gap-4">
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
      <div>
        <Label htmlFor="vat_amount" required>Montant TVA</Label>
        <Input
          id="vat_amount"
          type="number"
          step="0.01"
          value={formData.vat_amount}
          onChange={(e) => onChange('vat_amount', e.target.value)}
          placeholder="0.00"
          required
        />
      </div>
      <div>
        <Label htmlFor="total_amount" required>Montant TTC</Label>
        <Input
          id="total_amount"
          type="number"
          step="0.01"
          value={formData.total_amount}
          onChange={(e) => onChange('total_amount', e.target.value)}
          placeholder="0.00"
          required
        />
      </div>
    </div>
  );
};
