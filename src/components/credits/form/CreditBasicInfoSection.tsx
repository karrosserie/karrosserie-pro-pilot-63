
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Switch } from '@/components/ui/switch';
import { InvoiceSelect } from '@/components/receipts/form/InvoiceSelect';

interface CreditBasicInfoSectionProps {
  formData: any;
  errors?: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
}

export const CreditBasicInfoSection = ({ formData, errors, onFieldChange }: CreditBasicInfoSectionProps) => {
  const isFranchiseOffer = formData.is_franchise_offer || false;

  return (
    <div className="space-y-4">
      {/* Switch pour franchise offerte */}
      <div className="flex items-center space-x-2 p-4 border rounded-lg bg-slate-50">
        <Switch
          id="is_franchise_offer"
          checked={isFranchiseOffer}
          onCheckedChange={(checked) => onFieldChange('is_franchise_offer', checked)}
        />
        <Label htmlFor="is_franchise_offer" className="text-sm">
          Cet avoir correspond à une franchise offerte (nécessite la sélection d'une facture dans la liste ci-dessus)
        </Label>
      </div>

      {/* Première ligne : Numéro, Date, Statut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reference" required>Numéro</Label>
          <Input
            id="reference"
            value={formData.reference || ''}
            onChange={(e) => onFieldChange('reference', e.target.value)}
            placeholder="Numéro de l'avoir"
            required
          />
          {errors?.reference && (
            <p className="text-sm text-red-500">{errors.reference}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" required>Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date || ''}
            onChange={(e) => onFieldChange('date', e.target.value)}
            required
          />
          {errors?.date && (
            <p className="text-sm text-red-500">{errors.date}</p>
          )}
        </div>

        {!isFranchiseOffer && (
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <SearchableSelect
              options={[
                { value: 'En attente', label: 'En attente' },
                { value: 'Payé', label: 'Payé' }
              ]}
              value={formData.status || ''}
              onValueChange={(value) => onFieldChange('status', value)}
              placeholder="Sélectionner un statut"
            />
          </div>
        )}
      </div>

      {/* Sélection de facture */}
      <div className="space-y-2">
        <Label htmlFor="invoice_id" required>Facture</Label>
        <InvoiceSelect
          value={formData.invoice_id || ''}
          onChange={(value) => onFieldChange('invoice_id', value)}
        />
        {errors?.invoice_id && (
          <p className="text-sm text-red-500">{errors.invoice_id}</p>
        )}
      </div>
    </div>
  );
};
