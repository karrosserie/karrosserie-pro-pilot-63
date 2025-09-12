import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, TrendingUp, TrendingDown, CreditCard, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceiptsHeader } from '@/components/receipts/ReceiptsHeader';
import { ReceiptsTable } from '@/components/receipts/ReceiptsTable';
import ReceiptDialog from '@/components/receipts/ReceiptDialog';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ReceiptWithClient } from '@/services/supabase/receipts/types';
import { ExpensesHeader } from '@/components/expenses/ExpensesHeader';
import { ExpensesTable } from '@/components/expenses/ExpensesTable';
import ExpenseDialog from '@/components/expenses/ExpenseDialog';
import { useExpenses } from '@/hooks/use-expenses';
import { ExpenseWithRelations } from '@/services/supabase/expenses';
import { AccountsHeader } from '@/components/accounts/AccountsHeader';
import { AccountsTable } from '@/components/accounts/AccountsTable';
import AccountDialog from '@/components/accounts/AccountDialog';
import { useAccounts } from '@/hooks/use-accounts';
import { usePaymentStatistics } from '@/hooks/use-payment-statistics';
import { useQueryClient } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';

const PaymentManagement = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("overview");
  
  // Receipts state
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptWithClient | null>(null);
  
  // Expenses state
  const [expenseSearchTerm, setExpenseSearchTerm] = useState('');
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseWithRelations | null>(null);
  
  // Accounts state
  const [accountSearchTerm, setAccountSearchTerm] = useState('');
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  
  const isMobile = useIsMobile();
  
  // Receipts data
  const { receipts, isLoading, handleDelete, filterReceipts } = useReceiptsData();
  const filteredReceipts = filterReceipts(receipts, searchTerm);

  // Expenses data
  const { expenses, isLoading: expensesLoading, handleDelete: handleExpenseDelete, filterExpenses } = useExpenses();
  const filteredExpenses = filterExpenses(expenses, expenseSearchTerm);

  // Accounts data
  const { accounts, isLoading: accountsLoading, handleDelete: handleAccountDelete, handleSync, filterAccounts } = useAccounts();
  const filteredAccounts = filterAccounts(accounts, accountSearchTerm);

  // Payment statistics
  const { data: statistics, isLoading: statisticsLoading } = usePaymentStatistics();
  const queryClient = useQueryClient();

  // Invalidate statistics when receipts change
  const handleReceiptChange = () => {
    queryClient.invalidateQueries({ queryKey: ['payment-statistics'] });
  };

  // Receipts handlers
  const handleCreateReceipt = () => {
    setSelectedReceipt(null);
    setDialogOpen(true);
  };

  const handleEdit = (receipt: ReceiptWithClient) => {
    setSelectedReceipt(receipt);
    setDialogOpen(true);
  };

  // Expenses handlers
  const handleCreateExpense = () => {
    setSelectedExpense(null);
    setExpenseDialogOpen(true);
  };

  const handleEditExpense = (expense: ExpenseWithRelations) => {
    setSelectedExpense(expense);
    setExpenseDialogOpen(true);
  };

  // Accounts handlers
  const handleCreateAccount = () => {
    setSelectedAccount(null);
    setAccountDialogOpen(true);
  };

  const handleEditAccount = (account: any) => {
    setSelectedAccount(account);
    setAccountDialogOpen(true);
  };

  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-4 md:space-y-6`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'} font-bold tracking-tight`}>
            {isMobile ? 'Gestion paiements' : 'Gestion des paiements et des transactions'}
          </h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="receipts">Encaissements</TabsTrigger>
          <TabsTrigger value="expenses">Dépenses</TabsTrigger>
          <TabsTrigger value="accounts">Comptes actifs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Action Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("receipts")}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <ArrowUpCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Encaissements</h3>
                <p className="text-sm text-muted-foreground text-center">Gérer les recettes</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("expenses")}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <ArrowDownCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Dépenses</h3>
                <p className="text-sm text-muted-foreground text-center">Suivre les coûts</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("accounts")}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Comptes actifs</h3>
                <div className="text-xl sm:text-2xl font-bold mb-1">
                  {statisticsLoading ? "..." : statistics?.accounts.count || 0}
                </div>
                <p className="text-sm text-muted-foreground text-center">comptes bancaires</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-6">
              <ReceiptsHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onCreateReceipt={handleCreateReceipt}
              />
              
              <div className="card-container">
                <ReceiptsTable
                  receipts={filteredReceipts}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          {expensesLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-6">
              <ExpensesHeader
                searchTerm={expenseSearchTerm}
                onSearchChange={setExpenseSearchTerm}
                onCreateExpense={handleCreateExpense}
              />
              
              <ExpensesTable
                expenses={filteredExpenses}
                onEdit={handleEditExpense}
                onDelete={handleExpenseDelete}
                isLoading={expensesLoading}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          {accountsLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-6">
              <AccountsHeader
                searchTerm={accountSearchTerm}
                onSearchChange={setAccountSearchTerm}
                onCreateAccount={handleCreateAccount}
              />
              
              <AccountsTable
                accounts={filteredAccounts}
                onEdit={handleEditAccount}
                onDelete={handleAccountDelete}
                onSync={handleSync}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Receipt Dialog */}
      <ReceiptDialog
        receipt={selectedReceipt}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Expense Dialog */}
      <ExpenseDialog
        expense={selectedExpense}
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
      />

      {/* Account Dialog */}
      <AccountDialog
        account={selectedAccount}
        open={accountDialogOpen}
        onOpenChange={setAccountDialogOpen}
      />
    </div>
  );
};

export default PaymentManagement;