
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Account {
  id?: string;
  name: string;
  bank: string;
  iban: string;
  bic: string;
  balance: number;
  type: string;
  status: string;
}

interface AccountFormProps {
  account?: Account | null;
  onSubmit: (data: Account) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const AccountForm = ({
  account,
  onSubmit,
  onCancel,
  isSubmitting
}: AccountFormProps) => {
  const [formData, setFormData] = useState<Account>({
    name: '',
    bank: '',
    iban: '',
    bic: '',
    balance: 0,
    type: 'Courant',
    status: 'Actif'
  });

  useEffect(() => {
    if (account) {
      setFormData(account);
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof Account, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" required>Nom du compte</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Compte Principal"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="bank" required>Banque</Label>
          <Input
            id="bank"
            value={formData.bank}
            onChange={(e) => handleChange('bank', e.target.value)}
            placeholder="Banque Populaire"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="status" required>Statut</Label>
        <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Actif">Actif</SelectItem>
            <SelectItem value="Inactif">Inactif</SelectItem>
            <SelectItem value="Suspendu">Suspendu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="iban" required>IBAN</Label>
        <Input
          id="iban"
          value={formData.iban}
          onChange={(e) => handleChange('iban', e.target.value)}
          placeholder="FR76 1234 5678 9012 3456 7890 123"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bic" required>BIC</Label>
          <Input
            id="bic"
            value={formData.bic}
            onChange={(e) => handleChange('bic', e.target.value)}
            placeholder="CCBPFRPPNCY"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="balance">Solde initial</Label>
          <Input
            id="balance"
            type="number"
            step="0.01"
            value={formData.balance}
            onChange={(e) => handleChange('balance', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
        >
          {isSubmitting ? "Enregistrement..." : (account ? "Modifier" : "Créer")}
        </Button>
      </div>
    </form>
  );
};
