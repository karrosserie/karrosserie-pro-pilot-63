
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Expense } from './types';

interface BasicFieldsProps {
  formData: Expense;
  onChange: (field: keyof Expense, value: any) => void;
}

export const BasicFields = ({ formData, onChange }: BasicFieldsProps) => {
  const hasProofUploaded = formData.proof_url && formData.proof_url.trim() !== '';

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="date" required>Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => onChange('date', e.target.value)}
          required
          readOnly={!hasProofUploaded}
          className={!hasProofUploaded ? 'bg-gray-100 cursor-not-allowed' : ''}
        />
      </div>
      <div>
        <Label htmlFor="supplier" required>Fournisseur</Label>
        <Input
          id="supplier"
          value={formData.supplier}
          onChange={(e) => onChange('supplier', e.target.value)}
          placeholder="Nom du fournisseur"
          required
          readOnly={!hasProofUploaded}
          className={!hasProofUploaded ? 'bg-gray-100 cursor-not-allowed' : ''}
        />
      </div>
    </div>
  );
};
