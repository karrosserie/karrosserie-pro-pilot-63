
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { CreditFormData } from './types';
import { cn } from '@/lib/utils';

interface CreditBasicInfoSectionProps {
  formData: CreditFormData;
  errors: Record<string, string>;
  onFieldChange: (field: keyof CreditFormData, value: any) => void;
}

export const CreditBasicInfoSection = ({ 
  formData, 
  errors, 
  onFieldChange 
}: CreditBasicInfoSectionProps) => {
  const statusOptions = [
    { value: 'En attente', label: 'En attente' },
    { value: 'Validé', label: 'Validé' },
    { value: 'Annulé', label: 'Annulé' }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileText className="h-5 w-5 mr-2" />
          Informations de base
        </CardTitle>
        <CardDescription>
          Référence, facture d'origine et statut de l'avoir
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reference">Référence *</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => onFieldChange('reference', e.target.value)}
              placeholder="AV2024-XXX"
              className={cn(
                errors.reference && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.reference && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.reference}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => onFieldChange('status', value)}
            >
              <SelectTrigger 
                id="status"
                className={cn(
                  errors.status && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.status}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="original_invoice_reference">Facture d'origine *</Label>
            <Input
              id="original_invoice_reference"
              value={formData.original_invoice_reference}
              onChange={(e) => onFieldChange('original_invoice_reference', e.target.value)}
              placeholder="F2024-XXX"
              className={cn(
                errors.original_invoice_reference && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.original_invoice_reference && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.original_invoice_reference}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="amount">Montant *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e) => onFieldChange('amount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className={cn(
                errors.amount && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.amount}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="reason">Motif de l'avoir *</Label>
          <Textarea
            id="reason"
            value={formData.reason}
            onChange={(e) => onFieldChange('reason', e.target.value)}
            placeholder="Décrivez la raison de cet avoir..."
            rows={3}
            className={cn(
              errors.reason && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.reason && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.reason}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes || ''}
            onChange={(e) => onFieldChange('notes', e.target.value)}
            placeholder="Notes additionnelles..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
};
