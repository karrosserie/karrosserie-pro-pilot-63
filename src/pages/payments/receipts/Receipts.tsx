
import React, { useState } from 'react';
import { ReceiptsHeader } from '@/components/receipts/ReceiptsHeader';
import { ReceiptsTable } from '@/components/receipts/ReceiptsTable';
import ReceiptDialog from '@/components/receipts/ReceiptDialog';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Receipts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  
  const { receipts, isLoading, handleDelete, filterReceipts } = useReceiptsData();
  const filteredReceipts = filterReceipts(receipts, searchTerm);

  const handleCreateReceipt = () => {
    setSelectedReceipt(null);
    setDialogOpen(true);
  };

  const handleEdit = (receipt: any) => {
    setSelectedReceipt(receipt);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <ReceiptsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateReceipt={handleCreateReceipt}
      />
      
      <ReceiptsTable
        receipts={filteredReceipts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ReceiptDialog
        receipt={selectedReceipt}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Receipts;
