
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Switch } from '@/components/ui/switch';
import { useInvoices } from '@/hooks/use-invoices';

interface CreditBasicInfoSectionProps {
  formData: any;
  isViewMode: boolean;
  onChange: (field: string, value: any) => void;
}

export const CreditBasicInfoSection = ({ formData, isViewMode, onChange }: CreditBasicInfoSectionProps) => {
  const { invoices } = useInvoices();

  // Prepare invoice options for searchable select
  const invoiceOptions = invoices?.map(invoice => {
    const clientName = invoice.clients 
      ? `${invoice.clients.first_name} ${invoice.clients.last_name}`
      : 'Client inconnu';
    const formattedAmount = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(invoice.amount).replace('.', ',');
    
    return {
      value: invoice.id,
      label: `Facture n°${invoice.reference} - ${clientName} - ${formattedAmount}`
    };
  }) || [];

  const handleFranchiseChange = (checked: boolean) => {
    onChange('isFranchise', checked);
    if (!checked) {
      // Reset status when franchise is turned off
      onChange('status', 'En attente');
    }
  };

  return (
    <div className="space-y-4">
      {/* Switch pour franchise offerte */}
      <div className="flex items-center space-x-2 p-4 border rounded-lg bg-blue-50">
        <Switch
          id="isFranchise"
          checked={formData.isFranchise || false}
          onCheckedChange={handleFranchiseChange}
          disabled={isViewMode}
        />
        <Label htmlFor="isFranchise" className="text-sm">
          Cet avoir correspond à une franchise offerte (nécessite la sélection d'une facture dans la liste ci-dessus)
        </Label>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-${formData.isFranchise ? '2' : '3'} gap-4`}>
        <div className="space-y-2">
          <Label htmlFor="reference" required>Numéro</Label>
          <Input
            id="reference"
            value={formData.reference || ''}
            onChange={(e) => onChange('reference', e.target.value)}
            placeholder="N° d'avoir"
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

        {!formData.isFranchise && (
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={formData.status || ''} 
              onValueChange={(value) => onChange('status', value)}
              disabled={isViewMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Validé">Validé</SelectItem>
                <SelectItem value="Annulé">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoiceId" required>Facture</Label>
        <SearchableSelect
          options={invoiceOptions}
          value={formData.invoiceId || ''}
          onValueChange={(value) => onChange('invoiceId', value)}
          placeholder="Sélectionner une facture"
          searchPlaceholder="Rechercher une facture..."
          disabled={isViewMode}
        />
      </div>
    </div>
  );
};
