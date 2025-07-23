
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Transaction } from '@/hooks/use-accounting-data';
import { Calendar, User, CreditCard, Receipt, Euro } from 'lucide-react';

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransactionDetailsDialog = ({ 
  transaction, 
  open, 
  onOpenChange 
}: TransactionDetailsDialogProps) => {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Détails de la transaction
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge 
              variant={transaction.type === 'Encaissement' ? 'default' : 'secondary'}
              className={
                transaction.type === 'Encaissement' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }
            >
              {transaction.type}
            </Badge>
            {transaction.status === 'En attente' && (
              <Badge variant="destructive">
                En attente de paiement
              </Badge>
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-gray-600">{transaction.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Client</p>
                <p className="text-sm text-gray-600">{transaction.client}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Receipt className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-gray-600">{transaction.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Méthode de paiement</p>
                <p className="text-sm text-gray-600">{transaction.method}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Euro className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Montant</p>
                <p className={`text-sm font-bold ${
                  transaction.status === 'En attente' 
                    ? 'text-red-600' 
                    : transaction.type === 'Encaissement' 
                      ? 'text-green-600' 
                      : 'text-orange-600'
                }`}>
                  {transaction.type === 'Encaissement' ? '+' : '-'} {transaction.amount}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">ID de transaction</p>
            <p className="text-sm font-mono">{transaction.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
