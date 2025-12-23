import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, TrendingUp, TrendingDown, CreditCard, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReceiptsHeader, ReceiptSortOption } from '@/components/receipts/ReceiptsHeader';
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
  // Active tab state
  const [activeTab, setActiveTab] = useState<'receipts' | 'expenses' | 'accounts' | null>(null);
  
  // Receipts state
  const [searchTerm, setSearchTerm] = useState('');
  const [receiptSortOption, setReceiptSortOption] = useState<ReceiptSortOption>('recent-first');
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
  
  const filteredAndSortedReceipts = useMemo(() => {
    const filtered = filterReceipts(receipts, searchTerm);
    
    return [...filtered].sort((a, b) => {
      switch (receiptSortOption) {
        case 'alphabetical-asc': {
          const aName = (a.client || a.clients?.last_name || '').toLowerCase();
          const bName = (b.client || b.clients?.last_name || '').toLowerCase();
          return aName.localeCompare(bName, 'fr', { sensitivity: 'base' });
        }
        case 'alphabetical-desc': {
          const aName = (a.client || a.clients?.last_name || '').toLowerCase();
          const bName = (b.client || b.clients?.last_name || '').toLowerCase();
          return bName.localeCompare(aName, 'fr', { sensitivity: 'base' });
        }
        case 'recent-first':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest-first':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        default:
          return 0;
      }
    });
  }, [receipts, searchTerm, receiptSortOption, filterReceipts]);

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

      {/* Action Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card 
          className={`cursor-pointer hover:shadow-md transition-all ${activeTab === 'receipts' ? 'ring-2 ring-emerald-500 shadow-md' : ''}`} 
          onClick={() => setActiveTab(activeTab === 'receipts' ? null : 'receipts')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <ArrowUpCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Encaissements</h3>
            <p className="text-sm text-muted-foreground text-center">Gérer les recettes</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-md transition-all ${activeTab === 'expenses' ? 'ring-2 ring-red-500 shadow-md' : ''}`} 
          onClick={() => setActiveTab(activeTab === 'expenses' ? null : 'expenses')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ArrowDownCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Dépenses</h3>
            <p className="text-sm text-muted-foreground text-center">Suivre les coûts</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-md transition-all ${activeTab === 'accounts' ? 'ring-2 ring-purple-500 shadow-md' : ''}`} 
          onClick={() => setActiveTab(activeTab === 'accounts' ? null : 'accounts')}
        >
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

      {/* Tab Content */}
      {activeTab && (
        <Card className="mt-6">
          <CardContent className="p-6">
            {activeTab === 'receipts' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Gestion des encaissements</h2>
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
                      sortOption={receiptSortOption}
                      onSortChange={setReceiptSortOption}
                    />
                    
                    <div className="card-container">
                      <ReceiptsTable
                        receipts={filteredAndSortedReceipts}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'expenses' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Gestion des dépenses</h2>
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
              </div>
            )}

            {activeTab === 'accounts' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Gestion des comptes</h2>
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
              </div>
            )}
          </CardContent>
        </Card>
      )}

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