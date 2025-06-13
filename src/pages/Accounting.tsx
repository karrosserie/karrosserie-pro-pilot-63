
import React, { useState } from 'react';
import { AccountingHeader } from '@/components/accounting/AccountingHeader';
import { AccountingKpis } from '@/components/accounting/AccountingKpis';
import { AccountingTabs } from '@/components/accounting/AccountingTabs';
import { useAccountingData } from '@/hooks/use-accounting-data';
import { useToast } from '@/hooks/use-toast';

const Accounting = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'receipts' | 'expenses' | 'unpaid'>('all');
  const { transactions, isLoading, totalReceipts, totalExpenses, balance } = useAccountingData();
  const { toast } = useToast();
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'receipts' && transaction.type === 'Encaissement') ||
                         (selectedFilter === 'expenses' && transaction.type === 'Dépense') ||
                         (selectedFilter === 'unpaid' && transaction.status === 'En attente');
    
    return matchesSearch && matchesFilter;
  });

  const handleExport = (type: 'fec' | 'excel' | 'pdf') => {
    toast({
      title: `Export ${type.toUpperCase()} en cours`,
      description: "Votre fichier sera téléchargé dans quelques instants.",
    });
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des données comptables...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <AccountingHeader 
        onExport={handleExport}
      />
      
      <AccountingKpis 
        totalReceipts={totalReceipts}
        totalExpenses={totalExpenses}
        balance={balance}
        transactionCount={transactions.length}
      />
      
      <AccountingTabs
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        filteredTransactions={filteredTransactions}
      />
    </div>
  );
};

export default Accounting;
