
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvoiceSelect } from './form/InvoiceSelect';
import { Receipt } from './form/types';
import { useReceiptsData } from '@/hooks/use-receipts-data';

interface ReceiptFormProps {
  receipt?: Receipt | null;
  onSubmit: (formData: Receipt) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ReceiptForm = ({ receipt, onSubmit, onCancel, isSubmitting }: ReceiptFormProps) => {
  const { receipts } = useReceiptsData();
  const [formData, setFormData] = useState<Receipt>({
    reference: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: 'Encaissé',
    payment_method: 'Virement',
    bank_account: '',
    notes: '',
    payment_proofs: [],
    invoice: ''
  });

  // Calculer le prochain numéro d'encaissement
  const getNextReceiptNumber = () => {
    if (!receipts || receipts.length === 0) return 1;
    
    const existingNumbers = receipts
      .map(r => r.reference)
      .filter(ref => ref && /^\d+$/.test(ref))
      .map(ref => parseInt(ref!, 10))
      .filter(num => !isNaN(num));
    
    return existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
  };

  useEffect(() => {
    if (receipt) {
      setFormData({
        reference: receipt.reference || '',
        date: receipt.date || new Date().toISOString().split('T')[0],
        amount: receipt.amount || 0,
        status: receipt.status || 'Encaissé',
        payment_method: receipt.payment_method || 'Virement',
        bank_account: receipt.bank_account || '',
        notes: receipt.notes || '',
        payment_proofs: receipt.payment_proofs || [],
        invoice: receipt.invoice || ''
      });
    } else {
      // Pour un nouvel encaissement, générer automatiquement le numéro
      setFormData(prev => ({
        ...prev,
        reference: getNextReceiptNumber().toString()
      }));
    }
  }, [receipt, receipts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFieldChange = (field: keyof Receipt, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="reference">Numéro</Label>
          <Input
            id="reference"
            value={formData.reference}
            readOnly
            className="bg-muted"
            placeholder="Auto-généré"
          />
        </div>
        
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleFieldChange('date', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="bank_account">Compte bancaire</Label>
          <Input
            id="bank_account"
            value={formData.bank_account}
            onChange={(e) => handleFieldChange('bank_account', e.target.value)}
            placeholder="Compte de destination"
          />
        </div>
      </div>

      <InvoiceSelect
        value={formData.invoice}
        onChange={(value) => handleFieldChange('invoice', value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Montant (€)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleFieldChange('amount', parseFloat(e.target.value) || 0)}
            required
          />
        </div>

        <div>
          <Label htmlFor="payment_method">Mode de paiement</Label>
          <Select value={formData.payment_method} onValueChange={(value) => handleFieldChange('payment_method', value)}>
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
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleFieldChange('notes', e.target.value)}
          placeholder="Notes complémentaires..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
        >
          {isSubmitting ? 'Création...' : 'Créer l\'encaissement'}
        </Button>
      </div>
    </form>
  );
};
