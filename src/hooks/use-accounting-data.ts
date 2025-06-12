
import { useInvoices } from '@/hooks/use-invoices';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useQuery } from '@tanstack/react-query';
import { getExpenses } from '@/services/supabase/expenses/queries';
import { useMemo } from 'react';

export interface Transaction {
  id: string;
  reference: string;
  date: string;
  description: string;
  type: 'Encaissement' | 'Dépense';
  method: string;
  amount: number;
  status: string;
  originalData: any;
}

export function useAccountingData() {
  const { invoices, isLoading: invoicesLoading } = useInvoices();
  const { receipts, isLoading: receiptsLoading } = useReceiptsData();
  
  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses
  });

  const transactions = useMemo(() => {
    const allTransactions: Transaction[] = [];

    // Add receipts as income transactions
    if (receipts) {
      receipts.forEach(receipt => {
        allTransactions.push({
          id: receipt.id,
          reference: receipt.reference || 'N/A',
          date: new Date(receipt.date).toLocaleDateString('fr-FR'),
          description: `Encaissement ${receipt.invoice || 'sans facture'}`,
          type: 'Encaissement',
          method: receipt.payment_method,
          amount: Number(receipt.amount),
          status: receipt.status || 'En attente',
          originalData: receipt
        });
      });
    }

    // Add expenses as expense transactions
    if (expenses) {
      expenses.forEach(expense => {
        allTransactions.push({
          id: expense.id,
          reference: `EXP-${expense.id.slice(0, 8)}`,
          date: new Date(expense.date).toLocaleDateString('fr-FR'),
          description: `${expense.category} - ${expense.supplier}`,
          type: 'Dépense',
          method: expense.type,
          amount: Number(expense.total_amount),
          status: 'Payé',
          originalData: expense
        });
      });
    }

    // Sort by date (most recent first)
    return allTransactions.sort((a, b) => 
      new Date(b.originalData.date || b.originalData.created_at).getTime() - 
      new Date(a.originalData.date || a.originalData.created_at).getTime()
    );
  }, [receipts, expenses]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'Encaissement')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'Dépense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    const pendingReceipts = receipts?.filter(r => r.status === 'En attente').length || 0;

    return {
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: transactions.length,
      pendingReceipts
    };
  }, [transactions, receipts]);

  return {
    transactions,
    stats,
    isLoading: invoicesLoading || receiptsLoading || expensesLoading,
    invoices,
    receipts,
    expenses
  };
}
