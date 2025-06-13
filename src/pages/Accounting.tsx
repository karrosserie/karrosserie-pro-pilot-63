
import React, { useState } from 'react';
import StatsCards from '@/components/accounting/StatsCards';
import TransactionFilters from '@/components/accounting/TransactionFilters';
import TransactionTable from '@/components/accounting/TransactionTable';
import ReportContent from '@/components/accounting/ReportContent';
import { useAccountingData } from '@/hooks/use-accounting-data';

const Accounting = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'receipts' | 'expenses'>('all');
  const { transactions, statsCards, isLoading } = useAccountingData();
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'receipts' && transaction.type === 'Encaissement') ||
                         (selectedFilter === 'expenses' && transaction.type === 'Dépense');
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Comptabilité</h1>
          <p className="text-gray-600 mt-1">
            Consultez et gérez votre comptabilité.
          </p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des données comptables...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Comptabilité</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez votre comptabilité.
        </p>
      </div>
      
      <StatsCards cards={statsCards} />
      
      {/* Section Transactions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <TransactionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
        <TransactionTable transactions={filteredTransactions} />
      </div>
      
      {/* Section Rapports */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Rapports</h2>
        <ReportContent />
      </div>
    </div>
  );
};

export default Accounting;
