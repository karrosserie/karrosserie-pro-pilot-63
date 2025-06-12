
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, FileText } from 'lucide-react';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import ReportContent from './ReportContent';

interface AccountingTabsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredTransactions: any[];
}

const AccountingTabs = ({ searchTerm, setSearchTerm, filteredTransactions }: AccountingTabsProps) => {
  return (
    <Tabs defaultValue="transactions" className="w-full">
      <TabsList className="grid grid-cols-1 md:grid-cols-2 mb-6">
        <TabsTrigger value="transactions">
          <Receipt className="h-4 w-4 mr-2" />
          Transactions
        </TabsTrigger>
        <TabsTrigger value="reports">
          <FileText className="h-4 w-4 mr-2" />
          Rapports
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="transactions">
        <TransactionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <TransactionTable transactions={filteredTransactions} />
      </TabsContent>
      
      <TabsContent value="reports">
        <ReportContent />
      </TabsContent>
    </Tabs>
  );
};

export default AccountingTabs;
