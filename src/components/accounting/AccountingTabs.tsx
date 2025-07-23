
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportContent from './ReportContent';
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';
import { Transaction } from '@/hooks/use-accounting-data';
import type { DateRange } from 'react-day-picker';

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  return (
    <Tabs defaultValue="transactions" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-9 sm:h-10">
        <TabsTrigger value="transactions" className="text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-white">
          Transactions
        </TabsTrigger>
        <TabsTrigger value="reports" className="text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-white">
          Rapports
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="transactions" className="space-y-4 sm:space-y-6">
        <TransactionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          transactions={allTransactions}
          dateRange={dateRange}
          setDateRange={setDateRange}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
        
        <TransactionTable transactions={filteredTransactions} />
      </TabsContent>
      
      <TabsContent value="reports" className="space-y-4 sm:space-y-6">
        <ReportContent />
      </TabsContent>
    </Tabs>
  );
};
