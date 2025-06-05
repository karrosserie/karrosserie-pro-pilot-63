
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpenseForm } from './ExpenseForm';
import { useToast } from '@/hooks/use-toast';

interface Expense {
  id?: string;
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

interface ExpenseDialogProps {
  expense?: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExpenseDialog = ({
  expense,
  open,
  onOpenChange
}: ExpenseDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: Expense) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: expense ? "Dépense modifiée" : "Dépense créée",
        description: expense 
          ? `La dépense ${formData.reference} a été modifiée avec succès.`
          : "La nouvelle dépense a été créée avec succès."
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!isSubmitting ? onOpenChange : undefined}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {expense ? `Modifier la dépense - ${expense.reference}` : "Nouvelle dépense"}
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
