
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

interface AmountStatusFieldsProps {
  formData: Expense;
  onChange: (field: keyof Expense, value: any) => void;
}

export const AmountStatusFields = ({ formData, onChange }: AmountStatusFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="amount" required>Montant</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount || ''}
          onChange={(e) => onChange('amount', e.target.value ? parseFloat(e.target.value) : '')}
          placeholder="0.00"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="status" required>Statut</Label>
        <Select value={formData.status} onValueChange={(value) => onChange('status', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En attente">En attente</SelectItem>
            <SelectItem value="Payé">Payé</SelectItem>
            <SelectItem value="Annulé">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
