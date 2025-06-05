
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Expense } from './types';

interface SupplierCategoryFieldsProps {
  formData: Expense;
  onChange: (field: keyof Expense, value: any) => void;
}

export const SupplierCategoryFields = ({ formData, onChange }: SupplierCategoryFieldsProps) => {
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
        />
      </div>
      
      <div>
        <Label htmlFor="category" required>Catégorie</Label>
        <Select value={formData.category} onValueChange={(value) => onChange('category', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pièces détachées">Pièces détachées</SelectItem>
            <SelectItem value="Carburant">Carburant</SelectItem>
            <SelectItem value="Électricité">Électricité</SelectItem>
            <SelectItem value="Eau">Eau</SelectItem>
            <SelectItem value="Assurance">Assurance</SelectItem>
            <SelectItem value="Fournitures">Fournitures</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
