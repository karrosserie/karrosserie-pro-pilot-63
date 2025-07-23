import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Transaction } from '@/hooks/use-accounting-data';
import { useInvoices } from '@/hooks/use-invoices';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useExpenses } from '@/hooks/use-expenses';
import { 
  MoreHorizontal, 
  Edit
} from 'lucide-react';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import ReceiptDialog from '@/components/receipts/ReceiptDialog';
import ExpenseDialog from '@/components/expenses/ExpenseDialog';

interface TransactionActionsMenuProps {
  transaction: Transaction;
}

export const TransactionActionsMenu = ({ transaction }: TransactionActionsMenuProps) => {
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  
  const { invoices } = useInvoices();
  const { receipts } = useReceiptsData();
  const { expenses } = useExpenses();

  const handleEdit = () => {
    // Déterminer le type de transaction et ouvrir le bon dialog
    if (transaction.type === 'Encaissement') {
      // C'est soit un encaissement (receipt) soit une facture payée
      // Chercher d'abord dans les receipts
      const receipt = receipts?.find(r => r.id === transaction.id);
      if (receipt) {
        setReceiptDialogOpen(true);
      } else {
        // C'est probablement une facture en attente de paiement
        setInvoiceDialogOpen(true);
      }
    } else if (transaction.type === 'Dépense') {
      setExpenseDialogOpen(true);
    } else if (transaction.status === 'En attente') {
      // Facture en attente de paiement
      setInvoiceDialogOpen(true);
    }
  };

  // Trouver l'entité correspondante pour l'édition
  const invoice = invoices?.find(i => i.id === transaction.id);
  const receipt = receipts?.find(r => r.id === transaction.id);
  const expense = expenses?.find(e => e.id === transaction.id);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de modification de facture */}
      <InvoiceDialog
        invoice={invoice}
        open={invoiceDialogOpen}
        onOpenChange={(open) => setInvoiceDialogOpen(open)}
      />

      {/* Dialog de modification d'encaissement */}
      <ReceiptDialog
        receipt={receipt}
        open={receiptDialogOpen}
        onOpenChange={(open) => setReceiptDialogOpen(open)}
      />

      {/* Dialog de modification de dépense */}
      <ExpenseDialog
        expense={expense}
        open={expenseDialogOpen}
        onOpenChange={(open) => setExpenseDialogOpen(open)}
      />
    </>
  );
};