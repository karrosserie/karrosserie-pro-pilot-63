
import React, { useState } from 'react';
import { ReceiptsHeader } from '@/components/receipts/ReceiptsHeader';
import { ReceiptsTable } from '@/components/receipts/ReceiptsTable';
import ReceiptDialog from '@/components/receipts/ReceiptDialog';
import { useReceipts } from '@/hooks/use-receipts';

const Receipts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  
  const { receipts, handleDelete, filterReceipts } = useReceipts();
  const filteredReceipts = filterReceipts(receipts, searchTerm);

  const handleCreateReceipt = () => {
    setSelectedReceipt(null);
    setDialogOpen(true);
  };

  const handleEdit = (receipt: any) => {
    setSelectedReceipt(receipt);
    setDialogOpen(true);
  };

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
