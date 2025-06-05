
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
import { useInvoices } from '@/hooks/use-invoices';

interface Receipt {
  id?: string;
  reference: string;
  date: string;
  amount: number;
  status: string;
  invoice: string;
  payment_method: string;
  bank_account: string;
  notes?: string;
  payment_proofs?: string[];
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
  const { invoices, isLoading: isLoadingInvoices } = useInvoices();
  
  const [formData, setFormData] = useState<Receipt>({
    reference: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: 'En attente',
    invoice: '',
    payment_method: 'Virement',
    bank_account: 'Compte Principal',
    notes: '',
    payment_proofs: []
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // For now, we'll just store the file names
      // In a real implementation, you'd upload to storage and get URLs
      const fileNames = Array.from(files).map(file => file.name);
      setFormData(prev => ({
        ...prev,
        payment_proofs: [...(prev.payment_proofs || []), ...fileNames]
      }));
    }
  };

  const removeProof = (index: number) => {
    setFormData(prev => ({
      ...prev,
      payment_proofs: prev.payment_proofs?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Facture - Premier champ */}
      <div>
        <Label htmlFor="invoice" required>Facture</Label>
        <Select value={formData.invoice} onValueChange={(value) => handleChange('invoice', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une facture" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingInvoices ? (
              <SelectItem value="" disabled>Chargement...</SelectItem>
            ) : (
              invoices?.map((invoice) => (
                <SelectItem key={invoice.id} value={invoice.reference}>
                  {invoice.reference} - {invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'Client non assigné'} - {invoice.amount}€
                </SelectItem>
              )) || <SelectItem value="" disabled>Aucune facture disponible</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Date - Premier */}
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
        
        {/* Référence - Deuxième, non obligatoire */}
        <div>
          <Label htmlFor="reference">Référence</Label>
          <Input
            id="reference"
            value={formData.reference}
            onChange={(e) => handleChange('reference', e.target.value)}
            placeholder="ENC2024-001"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Méthode de paiement - Premier */}
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
              <SelectItem value="Argent mobile">Argent mobile</SelectItem>
              <SelectItem value="Paiement en ligne">Paiement en ligne</SelectItem>
              <SelectItem value="Autres">Autres</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Statut - Deuxième */}
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

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Informations complémentaires..."
          rows={3}
        />
      </div>

      {/* Upload de preuves de paiement */}
      <div>
        <Label htmlFor="payment_proofs">Preuves de paiement</Label>
        <div className="space-y-2">
          <Input
            id="payment_proofs"
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-karrosserie-orange file:text-white hover:file:bg-karrosserie-orange/90"
          />
          <p className="text-sm text-gray-500">
            Vous pouvez uploader plusieurs fichiers (images ou PDF)
          </p>
          
          {/* Liste des fichiers uploadés */}
          {formData.payment_proofs && formData.payment_proofs.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Fichiers ajoutés :</p>
              <div className="space-y-1">
                {formData.payment_proofs.map((proof, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{proof}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProof(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
