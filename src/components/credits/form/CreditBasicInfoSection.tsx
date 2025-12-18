
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useInvoices } from '@/hooks/use-invoices';
import { getClientDisplayName } from '@/utils/clientDisplayUtils';

interface CreditBasicInfoSectionProps {
  formData: any;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  readOnly?: boolean;
}

export const CreditBasicInfoSection = ({ 
  formData, 
  errors, 
  onFieldChange,
  readOnly = false
}: CreditBasicInfoSectionProps) => {
  const isFranchiseCredit = formData.is_franchise_credit || false;
  const { invoices } = useInvoices();

  const statusOptions = [
    { value: 'En attente', label: 'En attente' },
    { value: 'Payé', label: 'Payé' }
  ];

  const invoiceOptions = (invoices || []).map(invoice => ({
    value: invoice.id,
    label: `Facture n°${invoice.reference} - ${invoice.clients ? getClientDisplayName(invoice.clients) : 'Client non assigné'} - ${invoice.amount?.toFixed(2).replace('.', ',')} €`
  }));

  const handleFranchiseSwitchChange = (checked: boolean) => {
    if (readOnly) return;
    onFieldChange('is_franchise_credit', checked);
    if (checked) {
      // Franchise offerte = avoir automatiquement payé
      onFieldChange('status', 'Payé');
    } else {
      // Si on désactive le switch, on remet le statut par défaut
      onFieldChange('status', 'En attente');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileText className="h-5 w-5 mr-2" />
          Informations de base
        </CardTitle>
        <CardDescription>
          Numéro, date, statut et informations de l'avoir
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!readOnly && (
          <div className="flex items-center space-x-2 p-4 rounded-lg">
            <Switch 
              id="franchise-switch"
              checked={isFranchiseCredit}
              onCheckedChange={handleFranchiseSwitchChange}
              disabled={readOnly}
            />
            <Label htmlFor="franchise-switch" className="text-sm">
              Cet avoir correspond à une franchise offerte (nécessite la sélection d'une facture dans la liste ci-dessus)
            </Label>
          </div>
        )}

        <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
          <div>
            <Label htmlFor="reference" required>Numéro</Label>
            <Input
              id="reference"
              value={formData.reference || ''}
              readOnly
              className={cn(
                "bg-gray-50 cursor-not-allowed",
                errors.reference && "border-red-500"
              )}
              placeholder="Généré automatiquement"
            />
            {errors.reference && !readOnly && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.reference}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="created_date">Date</Label>
            <Input
              id="created_date"
              type="date"
              value={formData.created_date || new Date().toISOString().split('T')[0]}
              onChange={(e) => !readOnly && onFieldChange('created_date', e.target.value)}
              readOnly={readOnly}
              className={cn(
                readOnly && "bg-gray-50 cursor-not-allowed",
                errors.created_date && "border-red-500"
              )}
            />
            {errors.created_date && !readOnly && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.created_date}
              </p>
            )}
          </div>
          
          <div className="md:col-span-3">
            {!isFranchiseCredit && (
              <>
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status || 'En attente'}
                  onValueChange={(value) => !readOnly && onFieldChange('status', value)}
                  disabled={readOnly}
                >
                  <SelectTrigger 
                    id="status"
                    className={cn(
                      readOnly && "bg-gray-50 cursor-not-allowed",
                      errors.status && "border-red-500"
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
                {errors.status && !readOnly && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.status}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="invoice_id" required>Facture d'origine</Label>
          <SearchableSelect
            options={invoiceOptions}
            value={formData.invoice_id || ''}
            onValueChange={(value) => !readOnly && onFieldChange('invoice_id', value)}
            placeholder="Sélectionner une facture"
            searchPlaceholder="Rechercher une facture..."
            disabled={readOnly}
            className={cn(
              readOnly && "bg-gray-50 cursor-not-allowed",
              errors.invoice_id && "border-red-500"
            )}
          />
          {errors.invoice_id && !readOnly && (
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
            onChange={(e) => !readOnly && onFieldChange('notes', e.target.value)}
            placeholder="Notes supplémentaires"
            readOnly={readOnly}
            className={cn(
              readOnly && "bg-gray-50 cursor-not-allowed",
              errors.notes && "border-red-500"
            )}
            rows={3}
          />
          {errors.notes && !readOnly && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
