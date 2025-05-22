
import React, { useState } from 'react';
import StatsCards from '@/components/accounting/StatsCards';
import FinancialOverview from '@/components/accounting/FinancialOverview';
import AccountingTabs from '@/components/accounting/AccountingTabs';
import { mockTransactions, chartData, statsCards } from '@/components/accounting/mockData';

const Accounting = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTransactions = mockTransactions.filter(transaction => 
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Comptabilité</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez votre comptabilité.
        </p>
      </div>
      
      <StatsCards cards={statsCards} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <FinancialOverview chartData={chartData} className="lg:col-span-3" />
      </div>
      
      <AccountingTabs 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredTransactions={filteredTransactions}
      />
    </div>
  );
};

export default Accounting;
