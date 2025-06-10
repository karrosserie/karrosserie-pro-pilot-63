
import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useInvoices } from '@/hooks/use-invoices';

interface InvoiceSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const InvoiceSelect = ({ value, onChange }: InvoiceSelectProps) => {
  const { invoices, isLoading: isLoadingInvoices } = useInvoices();

  const formatInvoiceDisplay = (invoice: any) => {
    const clientName = invoice.clients 
      ? `${invoice.clients.first_name} ${invoice.clients.last_name}` 
      : 'Client non assigné';
    const amount = typeof invoice.amount === 'number' 
      ? invoice.amount.toFixed(2).replace('.', ',')
      : '0,00';
    return `Facture n°${invoice.reference} - ${clientName} - ${amount} €`;
  };

  // Préparer les options pour SearchableSelect
  const invoiceOptions = (invoices || []).map(invoice => ({
    value: invoice.id,
    label: formatInvoiceDisplay(invoice)
  }));

  return (
    <div>
      <Label htmlFor="invoice" className="block text-sm font-medium text-gray-700 mb-1">
        Facture <span className="text-red-500">*</span>
      </Label>
      <SearchableSelect
        options={invoiceOptions}
        value={value}
        onValueChange={onChange}
        placeholder={isLoadingInvoices ? "Chargement..." : "Sélectionner une facture"}
        searchPlaceholder="Rechercher une facture..."
        disabled={isLoadingInvoices}
      />
    </div>
  );
};
