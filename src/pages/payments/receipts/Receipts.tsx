
import React, { useState, useMemo } from 'react';
import { ReceiptsHeader, ReceiptSortOption } from '@/components/receipts/ReceiptsHeader';
import { ReceiptsTable } from '@/components/receipts/ReceiptsTable';
import ReceiptDialog from '@/components/receipts/ReceiptDialog';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useInvoices } from '@/hooks/use-invoices';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ReceiptWithClient } from '@/services/supabase/receipts/types';
import { useIsMobile } from '@/hooks/use-mobile';

const Receipts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<ReceiptSortOption>('recent-first');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptWithClient | null>(null);
  
  const { receipts, isLoading, handleDelete, filterReceipts } = useReceiptsData();
  const { invoices, isLoading: invoicesLoading } = useInvoices();
  const isMobile = useIsMobile();

  const filteredAndSortedReceipts = useMemo(() => {
    const filtered = filterReceipts(receipts, searchTerm);
    
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'alphabetical-asc': {
          const aName = (a.client || a.clients?.last_name || '').toLowerCase();
          const bName = (b.client || b.clients?.last_name || '').toLowerCase();
          return aName.localeCompare(bName, 'fr', { sensitivity: 'base' });
        }
        case 'alphabetical-desc': {
          const aName = (a.client || a.clients?.last_name || '').toLowerCase();
          const bName = (b.client || b.clients?.last_name || '').toLowerCase();
          return bName.localeCompare(aName, 'fr', { sensitivity: 'base' });
        }
        case 'recent-first':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest-first':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default:
          return 0;
      }
    });
  }, [receipts, searchTerm, sortOption, filterReceipts]);

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
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      
      <div className="card-container">
        <ReceiptsTable
          receipts={filteredAndSortedReceipts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ReceiptDialog
        receipt={selectedReceipt}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        invoices={invoices || []}
        invoicesLoading={invoicesLoading}
      />
    </div>
  );
};

export default Receipts;
