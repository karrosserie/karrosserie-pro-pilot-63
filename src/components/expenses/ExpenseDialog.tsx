
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
import { Expense } from './form/types';

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
      // Convert amounts to numbers for processing
      const processedData = {
        ...formData,
        vat_amount: typeof formData.vat_amount === 'string' ? parseFloat(formData.vat_amount) || 0 : formData.vat_amount,
        total_amount: typeof formData.total_amount === 'string' ? parseFloat(formData.total_amount) || 0 : formData.total_amount
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: expense ? "Dépense modifiée" : "Dépense créée",
        description: expense 
          ? `La dépense a été modifiée avec succès.`
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
