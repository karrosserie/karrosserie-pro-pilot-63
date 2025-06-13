
import React, { useState } from 'react';
import StatsCards from '@/components/accounting/StatsCards';
import TransactionTable from '@/components/accounting/TransactionTable';
import { useAccountingData } from '@/hooks/use-accounting-data';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Accounting = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { transactions, statsCards, isLoading } = useAccountingData();
  
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.client.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher une transaction..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <TransactionTable transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default Accounting;
