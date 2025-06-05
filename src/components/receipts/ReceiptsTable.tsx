
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Card } from '@/components/ui/card';
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

  return (
    <Card className="p-6">
      <DataTable 
        columns={columns} 
        data={receipts}
        searchKey="reference"
        searchPlaceholder="Rechercher par référence, client ou facture..."
      />
    </Card>
  );
};
