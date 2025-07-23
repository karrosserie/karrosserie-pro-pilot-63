
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Pencil, Trash, TrendingDown } from 'lucide-react';
import { ExpenseWithRelations } from '@/services/supabase/expenses';
import { StatusBadge } from '@/components/ui/status-badge';

interface ExpensesTableProps {
  expenses: ExpenseWithRelations[];
  onEdit: (expense: ExpenseWithRelations) => void;
  onDelete: (expense: ExpenseWithRelations) => void;
  isLoading?: boolean;
}

export const ExpensesTable = ({ expenses, onEdit, onDelete, isLoading }: ExpensesTableProps) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="card-container">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des dépenses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Fournisseur</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Montant TVA</TableHead>
            <TableHead>Montant TTC</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.type}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{expense.supplier}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>
                  {expense.vehicle ? (
                    <span className="text-sm">
                      {expense.vehicle.license_plate} - {expense.vehicle.car_brands?.name || 'Marque inconnue'} {expense.vehicle.car_models?.name || 'Modèle inconnu'}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Non assigné</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={expense.status} />
                </TableCell>
                <TableCell>{formatAmount(expense.vat_amount)}</TableCell>
                <TableCell>{formatAmount(expense.total_amount)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(expense)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDelete(expense)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                <div className="flex flex-col items-center justify-center py-8">
                  <TrendingDown className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-900">Aucune dépense</h3>
                  <p className="text-gray-500 mt-1">
                    Aucune dépense n'a été trouvée. Créez votre première dépense.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
