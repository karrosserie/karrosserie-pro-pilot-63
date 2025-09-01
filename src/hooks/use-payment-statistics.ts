import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/date-formatter';

export const usePaymentStatistics = () => {
  return useQuery({
    queryKey: ['payment-statistics'],
    queryFn: async () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

      // Get current month receipts
      const { data: currentMonthReceipts, error: receiptsError } = await supabase
        .from('receipts')
        .select('amount')
        .gte('date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .lt('date', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`);

      if (receiptsError) throw receiptsError;

      // Get last month receipts for comparison
      const { data: lastMonthReceipts, error: lastReceiptsError } = await supabase
        .from('receipts')
        .select('amount')
        .gte('date', `${lastMonthYear}-${lastMonth.toString().padStart(2, '0')}-01`)
        .lt('date', `${lastMonthYear}-${currentMonth.toString().padStart(2, '0')}-01`);

      if (lastReceiptsError) throw lastReceiptsError;

      // Get current month expenses
      const { data: currentMonthExpenses, error: expensesError } = await supabase
        .from('expenses')
        .select('total_amount')
        .gte('date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .lt('date', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`);

      if (expensesError) throw expensesError;

      // Get last month expenses for comparison
      const { data: lastMonthExpenses, error: lastExpensesError } = await supabase
        .from('expenses')
        .select('total_amount')
        .gte('date', `${lastMonthYear}-${lastMonth.toString().padStart(2, '0')}-01`)
        .lt('date', `${lastMonthYear}-${currentMonth.toString().padStart(2, '0')}-01`);

      if (lastExpensesError) throw lastExpensesError;

      // Get active accounts count
      const { data: accounts, error: accountsError } = await supabase
        .from('bank_accounts')
        .select('id')
        .eq('status', 'Actif');

      if (accountsError) throw accountsError;

      // Calculate totals
      const currentReceiptsTotal = currentMonthReceipts?.reduce((sum, receipt) => sum + (receipt.amount || 0), 0) || 0;
      const lastReceiptsTotal = lastMonthReceipts?.reduce((sum, receipt) => sum + (receipt.amount || 0), 0) || 0;
      const currentExpensesTotal = currentMonthExpenses?.reduce((sum, expense) => sum + (expense.total_amount || 0), 0) || 0;
      const lastExpensesTotal = lastMonthExpenses?.reduce((sum, expense) => sum + (expense.total_amount || 0), 0) || 0;

      // Calculate percentage changes
      const receiptsChange = lastReceiptsTotal > 0 ? ((currentReceiptsTotal - lastReceiptsTotal) / lastReceiptsTotal) * 100 : 0;
      const expensesChange = lastExpensesTotal > 0 ? ((currentExpensesTotal - lastExpensesTotal) / lastExpensesTotal) * 100 : 0;

      return {
        receipts: {
          current: currentReceiptsTotal,
          formatted: formatCurrency(currentReceiptsTotal),
          change: receiptsChange,
          changeFormatted: `${receiptsChange >= 0 ? '+' : ''}${receiptsChange.toFixed(1)}%`
        },
        expenses: {
          current: currentExpensesTotal,
          formatted: formatCurrency(currentExpensesTotal),
          change: expensesChange,
          changeFormatted: `${expensesChange >= 0 ? '+' : ''}${expensesChange.toFixed(1)}%`
        },
        accounts: {
          count: accounts?.length || 0
        }
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};