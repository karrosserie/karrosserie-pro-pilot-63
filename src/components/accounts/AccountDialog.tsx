
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountForm } from './AccountForm';
import { useToast } from '@/hooks/use-toast';

interface Account {
  id?: string;
  name: string;
  bank: string;
  iban: string;
  bic: string;
  balance: number;
  type: string;
  status: string;
}

interface AccountDialogProps {
  account?: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccountDialog = ({
  account,
  open,
  onOpenChange
}: AccountDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: Account) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: account ? "Compte modifié" : "Compte créé",
        description: account 
          ? `Le compte ${formData.name} a été modifié avec succès.`
          : "Le nouveau compte a été créé avec succès."
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
            {account ? `Modifier le compte - ${account.name}` : "Nouveau compte"}
          </DialogTitle>
          <DialogDescription>
            {account
              ? "Modifiez les détails du compte bancaire."
              : "Créez un nouveau compte bancaire en remplissant les informations ci-dessous."
            }
          </DialogDescription>
        </DialogHeader>
        
        <AccountForm
          account={account}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;
