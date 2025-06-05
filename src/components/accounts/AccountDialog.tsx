
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountForm } from './AccountForm';
import { useAccounts } from '@/hooks/use-accounts';

interface Account {
  id?: string;
  name: string;
  bank: string;
  iban: string;
  bic: string;
  balance: number;
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
  const { createAccount, updateAccount, isCreating, isUpdating } = useAccounts();

  const handleSubmit = async (formData: Account) => {
    try {
      if (account?.id) {
        updateAccount({
          id: account.id,
          updates: {
            name: formData.name,
            bank: formData.bank,
            iban: formData.iban,
            bic: formData.bic,
            balance: formData.balance,
            status: formData.status,
          }
        });
      } else {
        createAccount({
          name: formData.name,
          bank: formData.bank,
          iban: formData.iban,
          bic: formData.bic,
          balance: formData.balance,
          status: formData.status,
        });
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting account:', error);
    }
  };

  const isSubmitting = isCreating || isUpdating;

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
