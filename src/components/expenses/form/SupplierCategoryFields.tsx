
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
    <div className="grid grid-cols-2 gap-4">
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

      <div>
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
    </div>
  );
};
