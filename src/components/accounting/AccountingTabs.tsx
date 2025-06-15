
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportContent from './ReportContent';
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
    <Tabs defaultValue="reports" className="w-full">
      <TabsList className="grid w-full grid-cols-1 mb-6">
        <TabsTrigger value="reports" className="text-sm font-medium">
          Rapports
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="reports" className="space-y-6">
        <ReportContent />
      </TabsContent>
    </Tabs>
  );
};
