import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Pencil, Trash, Calendar, Euro, Building, Tag, Car } from 'lucide-react';
import { ExpenseWithRelations } from '@/services/supabase/expenses';

interface ExpenseMobileCardProps {
  expense: ExpenseWithRelations;
  onEdit: (expense: ExpenseWithRelations) => void;
  onDelete: (expense: ExpenseWithRelations) => void;
}

export const ExpenseMobileCard = ({ 
  expense, 
  onEdit, 
  onDelete 
}: ExpenseMobileCardProps) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <Euro className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">
              {expense.type}
            </h3>
            <StatusBadge status={expense.status} />
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-card-foreground">
            {formatAmount(expense.total_amount)}
          </div>
          <div className="text-sm text-muted-foreground">
            TVA: {formatAmount(expense.vat_amount)}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(expense.date).toLocaleDateString('fr-FR')}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Building className="h-4 w-4" />
          <span>{expense.supplier}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Tag className="h-4 w-4" />
          <span>{expense.category}</span>
        </div>

        {expense.vehicle && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Car className="h-4 w-4" />
            <span>
              {expense.vehicle.license_plate} - {expense.vehicle.car_brands?.name || 'Marque inconnue'} {expense.vehicle.car_models?.name || 'Modèle inconnu'}
            </span>
          </div>
        )}
      </div>

      <div className="flex space-x-2 pt-2 border-t">
        <Button variant="outline" size="sm" onClick={() => onEdit(expense)}>
          <Pencil className="h-4 w-4 mr-1" />
          Modifier
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="text-destructive hover:text-destructive border-destructive/20 hover:border-destructive" 
          onClick={() => onDelete(expense)}
        >
          <Trash className="h-4 w-4 mr-1" />
          Supprimer
        </Button>
      </div>
    </div>
  );
};