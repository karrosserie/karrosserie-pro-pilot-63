
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useInsuranceCompanies } from '@/hooks/use-insurance-companies';

interface CessionFormFieldsProps {
  formData: any;
  isViewMode: boolean;
  onChange: (field: string, value: any) => void;
}

export const CessionFormFields = ({ formData, isViewMode, onChange }: CessionFormFieldsProps) => {
  const { insuranceCompanies } = useInsuranceCompanies();

  // Prepare insurance company options for searchable select
  const insuranceOptions = insuranceCompanies.map(company => ({
    value: company.id,
    label: company.name
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reference" required>Référence</Label>
          <Input
            id="reference"
            value={formData.reference || ''}
            onChange={(e) => onChange('reference', e.target.value)}
            placeholder="Référence de la cession"
            disabled={isViewMode}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" required>Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date || ''}
            onChange={(e) => onChange('date', e.target.value)}
            disabled={isViewMode}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="insuranceCompanyId" required>Compagnie d'assurance</Label>
        <SearchableSelect
          options={insuranceOptions}
          value={formData.insuranceCompanyId || ''}
          onValueChange={(value) => onChange('insuranceCompanyId', value)}
          placeholder="Sélectionner une compagnie"
          searchPlaceholder="Rechercher une compagnie..."
          disabled={isViewMode}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount" required>Montant</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount || ''}
            onChange={(e) => onChange('amount', parseFloat(e.target.value) || 0)}
            placeholder="0,00"
            disabled={isViewMode}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <SearchableSelect
            options={[
              { value: 'En attente', label: 'En attente' },
              { value: 'Acceptée', label: 'Acceptée' },
              { value: 'Refusée', label: 'Refusée' }
            ]}
            value={formData.status || ''}
            onValueChange={(value) => onChange('status', value)}
            placeholder="Sélectionner un statut"
            disabled={isViewMode}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Notes supplémentaires..."
          disabled={isViewMode}
          rows={3}
        />
      </div>
    </div>
  );
};
