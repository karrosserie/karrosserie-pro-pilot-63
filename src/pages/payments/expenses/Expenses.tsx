
import React, { useState } from 'react';
import { ExpensesHeader } from '@/components/expenses/ExpensesHeader';
import { ExpensesTable } from '@/components/expenses/ExpensesTable';
import ExpenseDialog from '@/components/expenses/ExpenseDialog';
import { useExpenses } from '@/hooks/use-expenses';

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  
  const { expenses, handleDelete, filterExpenses } = useExpenses();
  const filteredExpenses = filterExpenses(expenses, searchTerm);

  const handleCreateExpense = () => {
    setSelectedExpense(null);
    setDialogOpen(true);
  };

  const handleEdit = (expense: any) => {
    setSelectedExpense(expense);
    setDialogOpen(true);
  };

  return (
    <div className="page-container">
      <ExpensesHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateExpense={handleCreateExpense}
      />
      
      <ExpensesTable
        expenses={filteredExpenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
