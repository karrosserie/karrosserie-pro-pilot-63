
import React, { useState } from 'react';
import { ExpensesHeader } from '@/components/expenses/ExpensesHeader';
import { ExpensesTable } from '@/components/expenses/ExpensesTable';
import ExpenseDialog from '@/components/expenses/ExpenseDialog';
import { useExpenses } from '@/hooks/use-expenses';
import { ExpenseWithRelations } from '@/services/supabase/expenses';
import { useIsMobile } from '@/hooks/use-mobile';

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseWithRelations | null>(null);
  
  const { expenses, isLoading, handleDelete, filterExpenses } = useExpenses();
  const filteredExpenses = filterExpenses(expenses, searchTerm);
  const isMobile = useIsMobile();

  const handleCreateExpense = () => {
    setSelectedExpense(null);
    setDialogOpen(true);
  };

  const handleEdit = (expense: ExpenseWithRelations) => {
    setSelectedExpense(expense);
    setDialogOpen(true);
  };

  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-4 md:space-y-6`}>
      <ExpensesHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateExpense={handleCreateExpense}
      />
      
      <ExpensesTable
        expenses={filteredExpenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <ExpenseDialog
        expense={selectedExpense}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Expenses;
