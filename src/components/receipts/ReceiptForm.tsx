
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AmountInput } from '@/components/ui/amount-input';
import { InvoiceSelect } from './form/InvoiceSelect';
import { Receipt } from './form/types';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useAccounts } from '@/hooks/use-accounts';
import { useInvoices } from '@/hooks/use-invoices';
import { receiptsService } from '@/services/supabase/receipts';
import { SimpleDocumentScanner } from '@/components/shared/document-scanner/SimpleDocumentScanner';
import { useStorage } from '@/hooks/use-storage';
import { useToast } from '@/hooks/use-toast';
import { Camera, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ReceiptFormProps {
  receipt?: Receipt | null;
  onSubmit: (formData: Receipt) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  preselectedInvoice?: { id: string; amount: number } | null;
}

export const ReceiptForm = ({ receipt, onSubmit, onCancel, isSubmitting, preselectedInvoice }: ReceiptFormProps) => {
  const { receipts } = useReceiptsData();
  const { accounts, isLoading: accountsLoading } = useAccounts();
  const { invoices } = useInvoices();
  const { uploadDocument } = useStorage();
  const { toast } = useToast();
  
  const [showScanner, setShowScanner] = useState(false);
  const [checkPreviewUrl, setCheckPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState<Receipt>({
    reference: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: 'Encaissé',
    payment_method: 'Virement',
    bank_account: '',
    notes: '',
    payment_proofs: [],
    invoice: '',
    check_scan_date: null
  });

  // Auto-générer la référence au chargement (comme dans le formulaire des avoirs)
  useEffect(() => {
    if (receipt) {
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
        invoice: receipt.invoice_id || receipt.invoice || '',
        check_scan_date: receipt.check_scan_date || null
      });
      
      // Si un chèque est déjà scanné, afficher la prévisualisation
      if (receipt.payment_proofs && receipt.payment_proofs.length > 0) {
        setCheckPreviewUrl(receipt.payment_proofs[0]);
      }
    } else {
      // Si c'est un nouvel encaissement, générer la référence
      const generateReference = async () => {
        try {
          const reference = await receiptsService.generateReference();
          setFormData(prev => {
            const newData = { 
              ...prev, 
              reference,
              // Si on a une facture pré-sélectionnée, pré-remplir l'invoice et le montant
              ...(preselectedInvoice ? {
                invoice: preselectedInvoice.id,
                amount: preselectedInvoice.amount
              } : {})
            };
            return newData;
          });
        } catch (error) {
          console.error('Error generating reference:', error);
          setFormData(prev => ({ 
            ...prev, 
            reference: '1',
            // Si on a une facture pré-sélectionnée, pré-remplir l'invoice et le montant même en cas d'erreur
            ...(preselectedInvoice ? {
              invoice: preselectedInvoice.id,
              amount: preselectedInvoice.amount
            } : {})
          }));
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

    // Si on change la facture, mettre à jour automatiquement le montant
    if (field === 'invoice' && value && invoices) {
      const selectedInvoice = invoices.find(inv => inv.id === value);
      if (selectedInvoice && selectedInvoice.amount) {
        setFormData(prev => ({
          ...prev,
          invoice: value,
          amount: selectedInvoice.amount
        }));
      }
    }
  };

  const handleCheckScan = async (blob: Blob) => {
    setShowScanner(false);
    setIsUploading(true);

    try {
      // Créer un nom de fichier unique
      const fileName = `check_${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      // Upload vers Supabase Storage (bucket: receipts-documents, type: checks)
      const uploadedUrl = await uploadDocument(file, 'receipts-documents', `checks/${fileName}`);

      if (uploadedUrl) {
        // Mettre à jour le formulaire avec l'URL du chèque et la date de scan
        setFormData(prev => ({
          ...prev,
          payment_proofs: [uploadedUrl],
          check_scan_date: new Date().toISOString()
        }));
        setCheckPreviewUrl(uploadedUrl);
        
        toast({
          title: "Chèque scanné",
          description: "Le chèque a été enregistré avec succès."
        });
      }
    } catch (error) {
      console.error('Error uploading check:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le chèque. Réessayez.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveCheck = () => {
    setFormData(prev => ({
      ...prev,
      payment_proofs: [],
      check_scan_date: null
    }));
    setCheckPreviewUrl(null);
  };

  const isCheckPayment = formData.payment_method === 'Chèque';

  return (
    <>
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
            <AmountInput
              id="amount"
              value={formData.amount}
              onChange={(value) => handleFieldChange('amount', value)}
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

        {/* Section scan de chèque - affichée uniquement si mode de paiement = Chèque */}
        {isCheckPayment && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <Label className="mb-3 block">Scan du chèque</Label>
            
            {isUploading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Enregistrement en cours...</span>
              </div>
            ) : checkPreviewUrl ? (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden border bg-background">
                  <img 
                    src={checkPreviewUrl} 
                    alt="Chèque scanné" 
                    className="w-full h-auto max-h-48 object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveCheck}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {formData.check_scan_date && (
                  <p className="text-xs text-muted-foreground">
                    Scanné le {new Date(formData.check_scan_date).toLocaleDateString('fr-FR')} à {new Date(formData.check_scan_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-24 border-dashed"
                onClick={() => setShowScanner(true)}
              >
                <Camera className="h-6 w-6 mr-2" />
                Scanner le chèque
              </Button>
            )}
          </div>
        )}

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
            disabled={isSubmitting || isUploading}
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          >
            {isSubmitting 
              ? (receipt ? 'Modification...' : 'Création...') 
              : (receipt ? 'Modifier l\'encaissement' : 'Créer l\'encaissement')
            }
          </Button>
        </div>
      </form>

      {/* Scanner modal */}
      {showScanner && (
        <SimpleDocumentScanner
          onCapture={handleCheckScan}
          onClose={() => setShowScanner(false)}
          documentType="check"
        />
      )}
    </>
  );
};
