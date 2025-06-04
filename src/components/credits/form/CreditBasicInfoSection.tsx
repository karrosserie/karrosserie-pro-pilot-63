
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { CreditFormData } from './types';
import { cn } from '@/lib/utils';
import { useInvoices } from '@/hooks/use-invoices';

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
  const { invoices } = useInvoices();
  
  const statusOptions = [
    { value: 'En attente', label: 'En attente' },
    { value: 'Payé', label: 'Payé' }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileText className="h-5 w-5 mr-2" />
          Informations de base
        </CardTitle>
        <CardDescription>
          Référence, facture et statut de l'avoir
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reference">Référence</Label>
            <Input
              id="reference"
              value={formData.reference}
              readOnly
              className="bg-gray-50"
            />
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

        <div>
          <Label htmlFor="invoice_id" required>Facture</Label>
          <Select
            value={formData.invoice_id || ''}
            onValueChange={(value) => onFieldChange('invoice_id', value)}
          >
            <SelectTrigger 
              id="invoice_id"
              className={cn(
                errors.invoice_id && "border-red-500 focus-visible:ring-red-500"
              )}
            >
              <SelectValue placeholder="Sélectionner une facture" />
            </SelectTrigger>
            <SelectContent>
              {invoices?.map((invoice) => (
                <SelectItem key={invoice.id} value={invoice.id}>
                  {invoice.reference} - {invoice.amount}€
                  {invoice.clients && ` - ${invoice.clients.first_name} ${invoice.clients.last_name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.invoice_id && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.invoice_id}
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
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
