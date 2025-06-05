
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { createReceiptsColumns } from './columns';
import { ReceiptWithClient } from '@/services/supabase/receipts/types';

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
      <div className="text-center py-8 text-gray-500">
        Aucun encaissement trouvé
      </div>
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
