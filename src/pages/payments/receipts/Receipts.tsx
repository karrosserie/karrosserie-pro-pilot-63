
import React, { useState } from 'react';
import { ReceiptsHeader } from '@/components/receipts/ReceiptsHeader';
import { ReceiptsTable } from '@/components/receipts/ReceiptsTable';
import ReceiptDialog from '@/components/receipts/ReceiptDialog';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ReceiptWithClient } from '@/services/supabase/receipts/types';
import { useIsMobile } from '@/hooks/use-mobile';

const Receipts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptWithClient | null>(null);
  
  const { receipts, isLoading, handleDelete, filterReceipts } = useReceiptsData();
  const filteredReceipts = filterReceipts(receipts, searchTerm);
  const isMobile = useIsMobile();

  const handleCreateReceipt = () => {
    setSelectedReceipt(null);
    setDialogOpen(true);
  };

  const handleEdit = (receipt: ReceiptWithClient) => {
    setSelectedReceipt(receipt);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-4 md:space-y-6`}>
      <ReceiptsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateReceipt={handleCreateReceipt}
      />
      
      <div className="card-container">
        <ReceiptsTable
          receipts={filteredReceipts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ReceiptDialog
        receipt={selectedReceipt}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Receipts;
