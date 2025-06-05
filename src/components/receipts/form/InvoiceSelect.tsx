
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoices } from '@/hooks/use-invoices';

interface InvoiceSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const InvoiceSelect = ({ value, onChange }: InvoiceSelectProps) => {
  const { invoices, isLoading: isLoadingInvoices } = useInvoices();

  return (
    <div>
      <Label htmlFor="invoice" required>Facture</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une facture" />
        </SelectTrigger>
        <SelectContent>
          {isLoadingInvoices ? (
            <SelectItem value="loading" disabled>Chargement...</SelectItem>
          ) : invoices && invoices.length > 0 ? (
            invoices.map((invoice) => (
              <SelectItem key={invoice.id} value={invoice.id}>
                {invoice.reference} - {invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'Client non assigné'} - {invoice.amount}€
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-invoices" disabled>Aucune facture disponible</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
