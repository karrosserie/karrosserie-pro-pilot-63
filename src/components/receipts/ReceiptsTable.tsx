
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { createReceiptsColumns } from './columns';
import { ReceiptWithClient } from '@/services/supabase/receipts/types';
import { Receipt } from 'lucide-react';

interface ReceiptsTableProps {
  receipts: ReceiptWithClient[];
  onEdit: (receipt: ReceiptWithClient) => void;
  onDelete: (receipt: ReceiptWithClient) => void;
}

export const ReceiptsTable = ({
  receipts,
  onEdit,
  onDelete
}: ReceiptsTableProps) => {
  const columns = createReceiptsColumns({ onEdit, onDelete });

  if (receipts.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="Aucun encaissement trouvé"
        description="Aucun encaissement correspondant à votre recherche n'a été trouvé."
      />
    );
  }

  return (
    <DataTable 
      columns={columns} 
      data={receipts}
      searchKey="reference"
      searchPlaceholder="Rechercher par référence, client ou facture..."
    />
  );
};
