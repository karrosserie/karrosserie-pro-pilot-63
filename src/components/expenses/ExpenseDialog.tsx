
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpenseForm } from './ExpenseForm';
import { useExpenses } from '@/hooks/use-expenses';
import { ExpenseWithRelations, NewExpense } from '@/services/supabase/expenses';
import { useAuthState } from '@/hooks/use-auth-state';
import { useCompanyId } from '@/hooks/use-company-id';

interface ExpenseDialogProps {
  expense?: ExpenseWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExpenseDialog = ({
  expense,
  open,
  onOpenChange
}: ExpenseDialogProps) => {
  const { createExpense, updateExpense, isCreating, isUpdating } = useExpenses();
  const { user } = useAuthState();
  const { companyId } = useCompanyId();
  
  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (formData: any) => {
    if (isSubmitting || !user) return;
    
    try {
      // Convert amounts to numbers for processing
      const processedData: NewExpense = {
        ...formData,
        company_id: companyId,
        vat_amount: typeof formData.vat_amount === 'string' ? parseFloat(formData.vat_amount) || 0 : formData.vat_amount,
        total_amount: typeof formData.total_amount === 'string' ? parseFloat(formData.total_amount) || 0 : formData.total_amount,
        vehicle_id: formData.assign_to_vehicle ? formData.vehicle_id : null
      };

      if (expense?.id) {
        // Update existing expense
        updateExpense({ id: expense.id, updates: processedData });
      } else {
        // Create new expense
        createExpense(processedData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!isSubmitting ? onOpenChange : undefined}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {expense ? `Modifier la dépense` : "Nouvelle dépense"}
          </DialogTitle>
          <DialogDescription>
            {expense
              ? "Modifiez les détails de la dépense."
              : "Créez une nouvelle dépense en remplissant les informations ci-dessous."
            }
          </DialogDescription>
        </DialogHeader>
        
        <ExpenseForm
          expense={expense}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDialog;
