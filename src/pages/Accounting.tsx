
import React, { useState } from 'react';
import StatsCards from '@/components/accounting/StatsCards';
import AccountingTabs from '@/components/accounting/AccountingTabs';
import { useAccountingData } from '@/hooks/use-accounting-data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Accounting = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { transactions, stats, isLoading } = useAccountingData();
  
  const filteredTransactions = transactions.filter(transaction => 
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create stats cards from real data
  const statsCards = [
    {
      title: "Chiffre d'affaires",
      value: `${stats.totalIncome.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
      change: "+0%",
      trend: "up" as const,
      color: "green"
    },
    {
      title: "Dépenses",
      value: `${stats.totalExpenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
      change: "+0%",
      trend: "down" as const,
      color: "red"
    },
    {
      title: "Solde",
      value: `${stats.balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
      change: "+0%",
      trend: stats.balance >= 0 ? "up" as const : "down" as const,
      color: stats.balance >= 0 ? "green" : "red"
    },
    {
      title: "Transactions",
      value: stats.transactionCount.toString(),
      change: "+0%",
      trend: "up" as const,
      color: "blue"
    }
  ];

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
