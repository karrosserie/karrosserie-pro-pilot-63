
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { GlobalTotals } from './types';

interface InvoiceDetailsSectionProps {
  description: string;
  paymentDetails: string;
  onFieldChange: (field: string, value: any) => void;
  globalTotals: GlobalTotals;
  isReadOnly: boolean;
}

export const InvoiceDetailsSection = ({
  description,
  paymentDetails,
  onFieldChange,
  globalTotals,
  isReadOnly
}: InvoiceDetailsSectionProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount).replace('.', ',');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileText className="h-5 w-5 mr-2" />
          Récapitulatif et détails
        </CardTitle>
        <CardDescription>
          Notes et montant total de la facture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="description">Notes</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            placeholder="Notes ou instructions spécifiques"
            rows={3}
            disabled={isReadOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="payment_details">Détails de paiement</Label>
          <Textarea
            id="payment_details"
            value={paymentDetails}
            onChange={(e) => onFieldChange('payment_details', e.target.value)}
            placeholder="Détails concernant le paiement (modalités, échéances, etc.)"
            rows={3}
            disabled={isReadOnly}
          />
        </div>

        <div className="space-y-2 border-t pt-3">
          <div className="flex justify-between">
            <span>Sous-total (HT):</span>
            <span>{formatCurrency(globalTotals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Remises:</span>
            <span>{formatCurrency(globalTotals.discountTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>TVA:</span>
            <span>{formatCurrency(globalTotals.vatTotal)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>TOTAL (TTC):</span>
            <span>{formatCurrency(globalTotals.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
