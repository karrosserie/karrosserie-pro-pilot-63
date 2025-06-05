import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Expense } from '@/components/expenses/form/types';

// Mock data for expenses
const mockExpenses: Expense[] = [
  {
    id: '1',
    type: 'Facture d\'achat',
    proof_url: '',
    date: '2024-01-15',
    vat_amount: 90.00,
    total_amount: 450.00,
    status: 'Payé',
    supplier: 'Total Energies',
    category: 'Carburant',
    assign_to_vehicle: true,
    vehicle_id: 'vehicle-1'
  },
  {
    id: '2',
    type: 'Note de frais',
    proof_url: '',
    date: '2024-01-20',
    vat_amount: 24.10,
    total_amount: 120.50,
    status: 'En attente',
    supplier: 'Autoroutes du Sud',
    category: 'Péage',
    assign_to_vehicle: false
  }
];

export const useExpenses = () => {
  const [expenses] = useState<Expense[]>(mockExpenses);
  const { toast } = useToast();

  const handleDelete = (expense: Expense) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cette dépense ?`)) {
      toast({
        title: "Suppression",
        description: `Dépense supprimée`
      });
    }
  };

  const filterExpenses = (expenses: Expense[], searchTerm: string) => {
    return expenses.filter(expense => 
      expense.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.type && expense.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return {
    expenses,
    handleDelete,
    filterExpenses
  };
};
