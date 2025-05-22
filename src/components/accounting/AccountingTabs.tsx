
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, ArrowDownCircle, ArrowUpCircle, FileText } from 'lucide-react';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import ReportContent from './ReportContent';
import { mockTransactions } from './mockData';

interface AccountingTabsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredTransactions: any[];
}

const AccountingTabs = ({ searchTerm, setSearchTerm, filteredTransactions }: AccountingTabsProps) => {
  return (
    <Tabs defaultValue="transactions" className="w-full">
      <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-6">
        <TabsTrigger value="transactions">
          <Receipt className="h-4 w-4 mr-2" />
          Transactions
        </TabsTrigger>
        <TabsTrigger value="income">
          <ArrowDownCircle className="h-4 w-4 mr-2" />
          Encaissements
        </TabsTrigger>
        <TabsTrigger value="expenses">
          <ArrowUpCircle className="h-4 w-4 mr-2" />
          Dépenses
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
      
      <TabsContent value="income">
        <div className="card-container p-6">
          <h3 className="text-lg font-semibold mb-4">Gestion des encaissements</h3>
          <p>Fonctionnalité en cours de développement.</p>
        </div>
      </TabsContent>
      
      <TabsContent value="expenses">
        <div className="card-container p-6">
          <h3 className="text-lg font-semibold mb-4">Gestion des dépenses</h3>
          <p>Fonctionnalité en cours de développement.</p>
        </div>
      </TabsContent>
      
      <TabsContent value="reports">
        <ReportContent />
      </TabsContent>
    </Tabs>
  );
};

export default AccountingTabs;
