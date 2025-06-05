
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Expense {
  id: string;
  reference: string;
  date: string;
  amount: number;
  status: string;
  supplier: string;
  category: string;
  payment_method: string;
  bank_account: string;
  description: string;
}

// Mock data for expenses
const mockExpenses: Expense[] = [
  {
    id: '1',
    reference: 'DEP2024-001',
    date: '2024-01-15',
    amount: 450.00,
    status: 'Payé',
    supplier: 'Fournisseur Auto Pièces',
    category: 'Pièces détachées',
    payment_method: 'Virement',
    bank_account: 'Compte Principal',
    description: 'Achat pièces Peugeot'
  },
  {
    id: '2',
    reference: 'DEP2024-002',
    date: '2024-01-20',
    amount: 120.50,
    status: 'En attente',
    supplier: 'EDF',
    category: 'Électricité',
    payment_method: 'Prélèvement',
    bank_account: 'Compte Principal',
    description: 'Facture électricité janvier'
  }
];

export const useExpenses = () => {
  const [expenses] = useState<Expense[]>(mockExpenses);
  const { toast } = useToast();

  const handleDelete = (expense: Expense) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la dépense ${expense.reference} ?`)) {
      toast({
        title: "Suppression",
        description: `Dépense ${expense.reference} supprimée`
      });
    }
  };

  const filterExpenses = (expenses: Expense[], searchTerm: string) => {
    return expenses.filter(expense => 
      expense.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    expenses,
    handleDelete,
    filterExpenses
  };
};
