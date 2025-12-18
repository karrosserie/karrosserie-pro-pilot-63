
import React, { useState, useMemo } from 'react';
import { ExpensesHeader, ExpenseSortOption } from '@/components/expenses/ExpensesHeader';
import { ExpensesTable } from '@/components/expenses/ExpensesTable';
import ExpenseDialog from '@/components/expenses/ExpenseDialog';
import { useExpenses } from '@/hooks/use-expenses';
import { ExpenseWithRelations } from '@/services/supabase/expenses';
import { useIsMobile } from '@/hooks/use-mobile';

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<ExpenseSortOption>('recent-first');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseWithRelations | null>(null);
  
  const { expenses, isLoading, handleDelete, filterExpenses } = useExpenses();
  const isMobile = useIsMobile();

  const filteredAndSortedExpenses = useMemo(() => {
    const filtered = filterExpenses(expenses, searchTerm);
    
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'alphabetical-asc': {
          const aName = (a.supplier || '').toLowerCase();
          const bName = (b.supplier || '').toLowerCase();
          return aName.localeCompare(bName, 'fr', { sensitivity: 'base' });
        }
        case 'alphabetical-desc': {
          const aName = (a.supplier || '').toLowerCase();
          const bName = (b.supplier || '').toLowerCase();
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
  }, [expenses, searchTerm, sortOption, filterExpenses]);

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
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      
      <ExpensesTable
        expenses={filteredAndSortedExpenses}
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
