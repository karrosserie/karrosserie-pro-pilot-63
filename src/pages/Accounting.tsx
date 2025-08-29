
import React, { useState } from 'react';
import { AccountingHeader } from '@/components/accounting/AccountingHeader';
import { AccountingKpis } from '@/components/accounting/AccountingKpis';
import ReportContent from '@/components/accounting/ReportContent';
import { useAccountingData } from '@/hooks/use-accounting-data';
import { useToast } from '@/hooks/use-toast';

const Accounting = () => {
  const { totalReceipts, totalExpenses, balance, transactions, isLoading } = useAccountingData();
  const { toast } = useToast();

  const handleExport = (type: 'fec' | 'excel' | 'pdf') => {
    toast({
      title: `Export ${type.toUpperCase()} en cours`,
      description: "Votre fichier sera téléchargé dans quelques instants.",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
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
    <div className="p-6 space-y-6">
      <AccountingHeader
        onExport={handleExport}
      />
      
      <AccountingKpis 
        totalReceipts={totalReceipts}
        totalExpenses={totalExpenses}
        balance={balance}
        transactionCount={transactions.length}
      />
      
      <ReportContent />
    </div>
  );
};

export default Accounting;
