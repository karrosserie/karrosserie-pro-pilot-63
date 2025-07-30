
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
import { useTableSorting } from '@/hooks/use-table-sorting';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';

interface ExpensesTableProps {
  expenses: ExpenseWithRelations[];
  onEdit: (expense: ExpenseWithRelations) => void;
  onDelete: (expense: ExpenseWithRelations) => void;
  isLoading?: boolean;
}

export const ExpensesTable = ({ expenses, onEdit, onDelete, isLoading }: ExpensesTableProps) => {
  const { sortedData, sortConfig, handleSort } = useTableSorting(expenses, 'date');
  
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
            <SortableTableHeader sortKey="type" sortConfig={sortConfig} onSort={handleSort}>
              Type
            </SortableTableHeader>
            <SortableTableHeader sortKey="date" sortConfig={sortConfig} onSort={handleSort}>
              Date
            </SortableTableHeader>
            <SortableTableHeader sortKey="supplier" sortConfig={sortConfig} onSort={handleSort}>
              Fournisseur
            </SortableTableHeader>
            <SortableTableHeader sortKey="category" sortConfig={sortConfig} onSort={handleSort}>
              Catégorie
            </SortableTableHeader>
            <SortableTableHeader sortKey="vehicle" sortConfig={sortConfig} onSort={handleSort}>
              Véhicule
            </SortableTableHeader>
            <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>
              Statut
            </SortableTableHeader>
            <SortableTableHeader sortKey="vat_amount" sortConfig={sortConfig} onSort={handleSort}>
              Montant TVA
            </SortableTableHeader>
            <SortableTableHeader sortKey="total_amount" sortConfig={sortConfig} onSort={handleSort}>
              Montant TTC
            </SortableTableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((expense) => (
              <React.Fragment key={expense.id}>
                <TableRow className="border-b-0">
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
                </TableRow>
                <TableRow className="border-t-0">
                  <TableCell colSpan={8} className="py-3 border-t-0">
                    <div className="flex flex-wrap gap-2 justify-end px-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onEdit(expense)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
                        onClick={() => onDelete(expense)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
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
