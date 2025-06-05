
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Expense } from './types';

interface StatusFieldProps {
  formData: Expense;
  onChange: (field: keyof Expense, value: any) => void;
}

export const StatusField = ({ formData, onChange }: StatusFieldProps) => {
  return (
    <div>
      <Label htmlFor="status" required>Statut</Label>
      <Select value={formData.status} onValueChange={(value) => onChange('status', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="En attente">En attente</SelectItem>
          <SelectItem value="Approuvé">Approuvé</SelectItem>
          <SelectItem value="Payé">Payé</SelectItem>
          <SelectItem value="Rejeté">Rejeté</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
