
import React from 'react';
import { SimpleReceiptsTable } from './SimpleReceiptsTable';
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
  return (
    <SimpleReceiptsTable
      receipts={receipts}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};
