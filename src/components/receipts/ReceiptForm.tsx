
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvoiceSelect } from './form/InvoiceSelect';
import { Receipt } from './form/types';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useAccounts } from '@/hooks/use-accounts';
import { receiptsService } from '@/services/supabase/receipts';

interface ReceiptFormProps {
  receipt?: Receipt | null;
  onSubmit: (formData: Receipt) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ReceiptForm = ({ receipt, onSubmit, onCancel, isSubmitting }: ReceiptFormProps) => {
  const { receipts } = useReceiptsData();
  const { accounts, isLoading: accountsLoading } = useAccounts();
  
  console.log('ReceiptForm - Accounts loaded:', accounts);
  console.log('ReceiptForm - Accounts loading state:', accountsLoading);
  console.log('ReceiptForm - Receipt prop:', receipt);
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

  // Auto-générer la référence au chargement (comme dans le formulaire des avoirs)
  useEffect(() => {
    console.log('ReceiptForm useEffect - receipt:', receipt);
    
    if (receipt) {
      console.log('Setting form data from existing receipt');
      // Si on modifie un encaissement existant, utiliser ses données
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
      console.log('Generating new reference for new receipt');
      // Si c'est un nouvel encaissement, générer la référence
      const generateReference = async () => {
        try {
          console.log('Calling receiptsService.generateReference()');
          const reference = await receiptsService.generateReference();
          console.log('Generated reference:', reference);
          setFormData(prev => {
            const newData = { ...prev, reference };
            console.log('Setting formData with reference:', newData);
            return newData;
          });
        } catch (error) {
          console.error('Error generating reference:', error);
          setFormData(prev => ({ ...prev, reference: '1' }));
        }
      };

      generateReference();
    }
  }, [receipt]);

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
      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label htmlFor="reference">Numéro <span className="text-red-500">*</span></Label>
          <Input
            id="reference"
            value={formData.reference || ''}
            readOnly
            className="bg-muted"
            placeholder="Généré automatiquement"
          />
        </div>
        
        <div>
          <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleFieldChange('date', e.target.value)}
            required
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="bank_account">Compte bancaire <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.bank_account || ""} 
            onValueChange={(value) => handleFieldChange('bank_account', value)} 
            required
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Sélectionner un compte" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              {accounts?.map((account) => (
                <SelectItem key={account.id} value={account.id || ""}>
                  {account.name} - {account.bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <InvoiceSelect
        value={formData.invoice}
        onChange={(value) => handleFieldChange('invoice', value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Montant (€) <span className="text-red-500">*</span></Label>
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
          <Label htmlFor="payment_method">Mode de paiement <span className="text-red-500">*</span></Label>
          <Select value={formData.payment_method} onValueChange={(value) => handleFieldChange('payment_method', value)} required>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
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
