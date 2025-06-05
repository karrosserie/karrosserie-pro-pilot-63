
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

interface AmountAccountFieldsProps {
  amount: number;
  bankAccount: string;
  onAmountChange: (value: number) => void;
  onBankAccountChange: (value: string) => void;
}

export const AmountAccountFields = ({
  amount,
  bankAccount,
  onAmountChange,
  onBankAccountChange
}: AmountAccountFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="amount" required>Montant</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="bank_account" required>Compte bancaire</Label>
        <Select value={bankAccount} onValueChange={onBankAccountChange}>
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
