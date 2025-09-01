import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, TrendingUp, TrendingDown, CreditCard, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

const PaymentManagement = () => {
  // Receipts modal state
  const [receiptsModalOpen, setReceiptsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptWithClient | null>(null);
  
  // Expenses modal state
  const [expensesModalOpen, setExpensesModalOpen] = useState(false);
  const [expenseSearchTerm, setExpenseSearchTerm] = useState('');
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseWithRelations | null>(null);
  
  // Accounts modal state
  const [accountsModalOpen, setAccountsModalOpen] = useState(false);
  const [accountSearchTerm, setAccountSearchTerm] = useState('');
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  
  // Receipts data
  const { receipts, isLoading, handleDelete, filterReceipts } = useReceiptsData();
  const filteredReceipts = filterReceipts(receipts, searchTerm);

  // Expenses data
  const { expenses, isLoading: expensesLoading, handleDelete: handleExpenseDelete, filterExpenses } = useExpenses();
  const filteredExpenses = filterExpenses(expenses, expenseSearchTerm);

  // Accounts data
  const { accounts, isLoading: accountsLoading, handleDelete: handleAccountDelete, handleSync, filterAccounts } = useAccounts();
  const filteredAccounts = filterAccounts(accounts, accountSearchTerm);

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

  const transactions = [
    {
      id: 1,
      name: "Société ABC",
      type: "Encaissement",
      date: "Aujourd'hui",
      amount: "+€2,450",
      status: "Confirmé",
      statusColor: "bg-emerald-500"
    },
    {
      id: 2,
      name: "Fournisseur XYZ",
      type: "Dépenses",
      date: "Hier",
      amount: "-€890",
      status: "Payé",
      statusColor: "bg-purple-500"
    },
    {
      id: 3,
      name: "Client DEF",
      type: "Encaissement",
      date: "2 jours",
      amount: "+€1,200",
      status: "En attente",
      statusColor: "bg-blue-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground">
            Gestion des paiements et transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle transaction
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Encaissements du mois
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€24,580</div>
            <p className="text-xs text-emerald-600">
              +12.5% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dépenses du mois
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€8,240</div>
            <p className="text-xs text-red-600">
              -3.2% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comptes actifs
            </CardTitle>
            <CreditCard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              +2 vs mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setReceiptsModalOpen(true)}>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <ArrowUpCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Encaissements</h3>
            <p className="text-sm text-muted-foreground text-center">Gérer les recettes</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setExpensesModalOpen(true)}>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ArrowDownCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Dépenses</h3>
            <p className="text-sm text-muted-foreground text-center">Suivre les coûts</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setAccountsModalOpen(true)}>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Comptes</h3>
            <p className="text-sm text-muted-foreground text-center">Gérer les comptes</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Transactions récentes</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-8 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'Encaissement' ? 'bg-emerald-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{transaction.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.type} • {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${
                    transaction.amount.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.amount}
                  </span>
                  <Badge variant="secondary" className={`${transaction.statusColor} text-white`}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Receipts Modal */}
      <Dialog open={receiptsModalOpen} onOpenChange={setReceiptsModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestion des encaissements</DialogTitle>
          </DialogHeader>
          
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
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <ReceiptDialog
        receipt={selectedReceipt}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Expenses Modal */}
      <Dialog open={expensesModalOpen} onOpenChange={setExpensesModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestion des dépenses</DialogTitle>
          </DialogHeader>
          
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
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <ExpenseDialog
        expense={selectedExpense}
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
      />

      {/* Accounts Modal */}
      <Dialog open={accountsModalOpen} onOpenChange={setAccountsModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestion des comptes</DialogTitle>
          </DialogHeader>
          
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
        </DialogContent>
      </Dialog>

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