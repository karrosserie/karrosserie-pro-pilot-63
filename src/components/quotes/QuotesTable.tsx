
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { FileText } from 'lucide-react';
import { Quote } from '@/services/supabase/quotes';
import { QuoteTableRow } from './QuoteTableRow';

interface QuotesTableProps {
  quotes: Quote[];
  onEdit: (quote: Quote) => void;
  onDelete: (quote: Quote) => void;
}

export const QuotesTable = ({ quotes, onEdit, onDelete }: QuotesTableProps) => {
  if (quotes.length === 0) {
    return (
      <div className="card-container">
        <EmptyState
          icon={FileText}
          title="Aucun devis"
          description="Aucun devis n'a été trouvé. Créez-en un nouveau pour commencer."
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
          {quotes.map((quote) => (
            <QuoteTableRow
              key={quote.id}
              quote={quote}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
