
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';
import ReportContent from './ReportContent';
import { ForecastContent } from './ForecastContent';
import { Transaction } from '@/hooks/use-accounting-data';

interface AccountingTabsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: 'all' | 'receipts' | 'expenses' | 'unpaid';
  setSelectedFilter: (filter: 'all' | 'receipts' | 'expenses' | 'unpaid') => void;
  filteredTransactions: Transaction[];
  allTransactions: Transaction[];
}

export const AccountingTabs = ({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  filteredTransactions,
  allTransactions
}: AccountingTabsProps) => {
  return (
    <Tabs defaultValue="transactions" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="transactions" className="text-sm font-medium">
          Transactions
        </TabsTrigger>
        <TabsTrigger value="reports" className="text-sm font-medium">
          Rapports
        </TabsTrigger>
        <TabsTrigger value="forecasts" className="text-sm font-medium">
          Prévisions
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="transactions" className="space-y-6">
        <TransactionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          transactions={allTransactions}
        />
        <TransactionTable transactions={filteredTransactions} />
      </TabsContent>
      
      <TabsContent value="reports" className="space-y-6">
        <ReportContent />
      </TabsContent>
      
      <TabsContent value="forecasts" className="space-y-6">
        <ForecastContent />
      </TabsContent>
    </Tabs>
  );
};
