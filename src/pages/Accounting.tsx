
import React, { useState } from 'react';
import StatsCards from '@/components/accounting/StatsCards';
import AccountingTabs from '@/components/accounting/AccountingTabs';
import { useAccountingData } from '@/hooks/use-accounting-data';

const Accounting = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { transactions, statsCards, isLoading } = useAccountingData();
  
  const filteredTransactions = transactions.filter(transaction => 
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      <AccountingTabs 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredTransactions={filteredTransactions}
      />
    </div>
  );
};

export default Accounting;
