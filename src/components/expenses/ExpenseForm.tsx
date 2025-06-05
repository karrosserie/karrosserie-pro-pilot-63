
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

interface Expense {
  id?: string;
  reference: string;
  date: string;
  amount: number;
  status: string;
  supplier: string;
  category: string;
  payment_method: string;
  bank_account: string;
  description: string;
}

interface ExpenseFormProps {
  expense?: Expense | null;
  onSubmit: (data: Expense) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ExpenseForm = ({
  expense,
  onSubmit,
  onCancel,
  isSubmitting
}: ExpenseFormProps) => {
  const [formData, setFormData] = useState<Expense>({
    reference: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: 'En attente',
    supplier: '',
    category: 'Pièces détachées',
    payment_method: 'Virement',
    bank_account: 'Compte Principal',
    description: ''
  });

  useEffect(() => {
    if (expense) {
      setFormData(expense);
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof Expense, value: any) => {
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
            placeholder="DEP2024-001"
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
          <Label htmlFor="supplier" required>Fournisseur</Label>
          <Input
            id="supplier"
            value={formData.supplier}
            onChange={(e) => handleChange('supplier', e.target.value)}
            placeholder="Nom du fournisseur"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="category" required>Catégorie</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
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

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Description détaillée de la dépense"
          rows={3}
        />
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
              <SelectItem value="Payé">Payé</SelectItem>
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
              <SelectItem value="Prélèvement">Prélèvement</SelectItem>
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
          {isSubmitting ? "Enregistrement..." : (expense ? "Modifier" : "Créer")}
        </Button>
      </div>
    </form>
  );
};
