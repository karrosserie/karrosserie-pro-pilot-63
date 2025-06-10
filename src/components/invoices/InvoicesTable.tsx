
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { FileText } from 'lucide-react';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceTableRow } from './InvoiceTableRow';

interface InvoicesTableProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export const InvoicesTable = ({ invoices, onEdit, onDelete }: InvoicesTableProps) => {
  if (invoices.length === 0) {
    return (
      <div className="card-container">
        <EmptyState
          icon={FileText}
          title="Aucune facture"
          description="Aucune facture n'a été trouvée. Créez-en une nouvelle pour commencer."
        />
      </div>
    );
  }

  return (
    <div className="card-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <InvoiceTableRow
              key={invoice.id}
              invoice={invoice}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
