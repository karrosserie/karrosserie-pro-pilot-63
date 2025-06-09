
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Expense } from './types';

interface SupplierCategoryFieldsProps {
  formData: Expense;
  onChange: (field: keyof Expense, value: any) => void;
}

export const SupplierCategoryFields = ({ formData, onChange }: SupplierCategoryFieldsProps) => {
  const hasProofUploaded = formData.proof_url && formData.proof_url.trim() !== '';

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="md:col-span-2">
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
        <Input
          id="vat_amount"
          type="number"
          step="0.01"
          value={formData.vat_amount}
          onChange={(e) => onChange('vat_amount', e.target.value)}
          placeholder="0,00"
          required
          readOnly={!hasProofUploaded}
          className={!hasProofUploaded ? 'bg-gray-100 cursor-not-allowed' : ''}
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
          placeholder="0,00"
          required
          readOnly={!hasProofUploaded}
          className={!hasProofUploaded ? 'bg-gray-100 cursor-not-allowed' : ''}
        />
      </div>
    </div>
  );
};
