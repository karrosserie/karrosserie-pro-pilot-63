
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Expense } from './types';

interface PaymentFieldsProps {
  formData: Expense;
  onChange: (field: keyof Expense, value: any) => void;
}

export const PaymentFields = ({ formData, onChange }: PaymentFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="payment_method" required>Méthode de paiement</Label>
        <Select value={formData.payment_method} onValueChange={(value) => onChange('payment_method', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Virement">Virement</SelectItem>
            <SelectItem value="Chèque">Chèque</SelectItem>
            <SelectItem value="Espèces">Espèces</SelectItem>
            <SelectItem value="Carte bancaire">Carte bancaire</SelectItem>
            <SelectItem value="Prélèvement">Prélèvement</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="bank_account" required>Compte bancaire</Label>
        <Select value={formData.bank_account} onValueChange={(value) => onChange('bank_account', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Compte Principal">Compte Principal</SelectItem>
            <SelectItem value="Compte Épargne">Compte Épargne</SelectItem>
            <SelectItem value="Compte Professionnel">Compte Professionnel</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
