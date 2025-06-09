
import React from 'react';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useInvoices } from '@/hooks/use-invoices';

interface InvoiceSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const InvoiceSelect = ({ value, onChange, disabled }: InvoiceSelectProps) => {
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

  return (
    <SearchableSelect
      options={invoiceOptions}
      value={value}
      onValueChange={onChange}
      placeholder="Sélectionner une facture"
      searchPlaceholder="Rechercher une facture..."
      disabled={disabled}
    />
  );
};
