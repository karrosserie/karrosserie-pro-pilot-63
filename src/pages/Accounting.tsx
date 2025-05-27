
import React, { useState } from 'react';
import StatsCards from '@/components/accounting/StatsCards';
import FinancialOverview from '@/components/accounting/FinancialOverview';
import AccountingTabs from '@/components/accounting/AccountingTabs';
import SecretariatIA from '@/components/accounting/SecretariatIA';
import { mockTransactions, chartData, statsCards } from '@/components/accounting/mockData';

const Accounting = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const filteredTransactions = mockTransactions.filter(transaction => 
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (activeTab === 'secretariat-ia') {
    return (
      <div className="page-container">
        <SecretariatIA />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Comptabilité</h1>
            <p className="text-gray-600 mt-1">
              Consultez et gérez votre comptabilité.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-karrosserie-orange text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('secretariat-ia')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'secretariat-ia'
                  ? 'bg-karrosserie-orange text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Secrétariat IA
            </button>
          </div>
        </div>
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
