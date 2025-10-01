
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AmountInput } from '@/components/ui/amount-input';
import { Expense } from './types';

interface SupplierCategoryFieldsProps {
  formData: Expense;
  onChange: (field: keyof Expense, value: any) => void;
}

export const SupplierCategoryFields = ({ formData, onChange }: SupplierCategoryFieldsProps) => {
  const hasProofUploaded = formData.proof_url && formData.proof_url.trim() !== '';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="sm:col-span-2 lg:col-span-2">
        <Label htmlFor="category" required>Catégorie</Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => onChange('category', value)}
          disabled={!hasProofUploaded}
        >
          <SelectTrigger className={!hasProofUploaded ? 'bg-gray-100 cursor-not-allowed' : ''}>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Péage">Péage</SelectItem>
            <SelectItem value="Carburant">Carburant</SelectItem>
            <SelectItem value="Hôtel">Hôtel</SelectItem>
            <SelectItem value="Restaurant">Restaurant</SelectItem>
            <SelectItem value="Autres">Autres</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="vat_amount" required>Montant TVA</Label>
        <AmountInput
          id="vat_amount"
          value={formData.vat_amount}
          onChange={(value) => onChange('vat_amount', value)}
          required
          readOnly={!hasProofUploaded}
          className={!hasProofUploaded ? 'bg-gray-100 cursor-not-allowed' : ''}
        />
      </div>

      <div>
        <Label htmlFor="total_amount" required>Montant TTC</Label>
        <AmountInput
          id="total_amount"
          value={formData.total_amount}
          onChange={(value) => onChange('total_amount', value)}
          required
          readOnly={!hasProofUploaded}
          className={!hasProofUploaded ? 'bg-gray-100 cursor-not-allowed' : ''}
        />
      </div>
    </div>
  );
};
