
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { FileText } from 'lucide-react';
import { Quote } from '@/services/supabase/quotes';
import { QuoteTableRow } from './QuoteTableRow';

// Extended Quote type that includes the related data fetched by quotesService.getAll()
type QuoteWithRelations = Quote & {
  clients: { id: string; first_name: string; last_name: string } | null;
  vehicles: { id: string; brand: string; model: string; license_plate: string } | null;
};

interface QuotesTableProps {
  quotes: QuoteWithRelations[];
  onEdit: (quote: QuoteWithRelations) => void;
  onDelete: (quote: QuoteWithRelations) => void;
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
