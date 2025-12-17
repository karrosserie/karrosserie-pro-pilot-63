
import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Invoice } from '@/services/supabase/invoices';

interface InvoiceSelectProps {
  value: string;
  onChange: (value: string) => void;
  invoices: Invoice[];
  isLoading?: boolean;
}

export const InvoiceSelect = ({ value, onChange, invoices, isLoading }: InvoiceSelectProps) => {
  const formatInvoiceDisplay = (invoice: Invoice) => {
    const clientName = invoice.clients 
      ? `${invoice.clients.first_name} ${invoice.clients.last_name}` 
      : 'Client non assigné';
    const amount = typeof invoice.amount === 'number' 
      ? invoice.amount.toFixed(2).replace('.', ',')
      : '0,00';
    return `Facture n°${invoice.reference} - ${clientName} - ${amount} €`;
  };

  // Filtrer pour n'afficher que les factures non archivées
  const activeInvoices = (invoices || []).filter(inv => !inv.archived);

  // Préparer les options pour SearchableSelect
  const invoiceOptions = activeInvoices.map(invoice => ({
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
        placeholder={isLoading ? "Chargement..." : "Sélectionner une facture"}
        searchPlaceholder="Rechercher une facture..."
        disabled={isLoading}
      />
    </div>
  );
};
