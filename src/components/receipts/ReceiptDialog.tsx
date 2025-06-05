
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReceiptForm } from './ReceiptForm';
import { useToast } from '@/hooks/use-toast';

interface Receipt {
  id?: string;
  reference: string;
  date: string;
  amount: number;
  status: string;
  client: string;
  invoice: string;
  payment_method: string;
  bank_account: string;
}

interface ReceiptDialogProps {
  receipt?: Receipt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReceiptDialog = ({
  receipt,
  open,
  onOpenChange
}: ReceiptDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: Receipt) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: receipt ? "Encaissement modifié" : "Encaissement créé",
        description: receipt 
          ? `L'encaissement ${formData.reference} a été modifié avec succès.`
          : "Le nouvel encaissement a été créé avec succès."
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
            {receipt ? `Modifier l'encaissement - ${receipt.reference}` : "Nouvel encaissement"}
          </DialogTitle>
          <DialogDescription>
            {receipt
              ? "Modifiez les détails de l'encaissement."
              : "Créez un nouvel encaissement en remplissant les informations ci-dessous."
            }
          </DialogDescription>
        </DialogHeader>
        
        <ReceiptForm
          receipt={receipt}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
