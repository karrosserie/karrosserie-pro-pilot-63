
import React from 'react';
import { SimpleReceiptsTable } from './SimpleReceiptsTable';
import { ReceiptWithClient } from '@/services/supabase/receipts/types';
import { useIsMobile } from '@/hooks/use-mobile';
import ReceiptMobileCard from './ReceiptMobileCard';

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
  const isMobile = useIsMobile();
  
  if (isMobile) {
    const formatAmount = (amount: number | null | undefined): string => {
      if (!amount) return '0,00 €';
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount);
    };

    const formatDate = (dateString: string | null): string => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getStatusColor = (status: string): string => {
      return 'bg-green-100 text-green-800';
    };

    return (
      <div className="space-y-4">
        {receipts.map((receipt) => (
          <ReceiptMobileCard
            key={receipt.id}
            receipt={receipt}
            onEdit={onEdit}
            onDelete={onDelete}
            formatAmount={formatAmount}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>
    );
  }
  
  return (
    <SimpleReceiptsTable
      receipts={receipts}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};
