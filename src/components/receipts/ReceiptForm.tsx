
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
import { Textarea } from '@/components/ui/textarea';

interface Receipt {
  id?: string;
  reference: string;
  date: string;
  amount: number;
  status: string;
  client: string;
  invoice: string;
  payment_method: string;
  bank_account: string;
}

interface ReceiptFormProps {
  receipt?: Receipt | null;
  onSubmit: (data: Receipt) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ReceiptForm = ({
  receipt,
  onSubmit,
  onCancel,
  isSubmitting
}: ReceiptFormProps) => {
  const [formData, setFormData] = useState<Receipt>({
    reference: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: 'En attente',
    client: '',
    invoice: '',
    payment_method: 'Virement',
    bank_account: 'Compte Principal'
  });

  useEffect(() => {
    if (receipt) {
      setFormData(receipt);
    }
  }, [receipt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof Receipt, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="reference" required>Référence</Label>
          <Input
            id="reference"
            value={formData.reference}
            onChange={(e) => handleChange('reference', e.target.value)}
            placeholder="ENC2024-001"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="date" required>Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client" required>Client</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => handleChange('client', e.target.value)}
            placeholder="Nom du client"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="invoice" required>Facture</Label>
          <Input
            id="invoice"
            value={formData.invoice}
            onChange={(e) => handleChange('invoice', e.target.value)}
            placeholder="F2024-001"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount" required>Montant</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="status" required>Statut</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="En attente">En attente</SelectItem>
              <SelectItem value="Encaissé">Encaissé</SelectItem>
              <SelectItem value="Annulé">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="payment_method" required>Méthode de paiement</Label>
          <Select value={formData.payment_method} onValueChange={(value) => handleChange('payment_method', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Virement">Virement</SelectItem>
              <SelectItem value="Chèque">Chèque</SelectItem>
              <SelectItem value="Espèces">Espèces</SelectItem>
              <SelectItem value="Carte bancaire">Carte bancaire</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="bank_account" required>Compte bancaire</Label>
          <Select value={formData.bank_account} onValueChange={(value) => handleChange('bank_account', value)}>
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
          {isSubmitting ? "Enregistrement..." : (receipt ? "Modifier" : "Créer")}
        </Button>
      </div>
    </form>
  );
};
