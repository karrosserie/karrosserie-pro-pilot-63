
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Eye, Pencil, Trash, Receipt } from "lucide-react";
import { ReceiptWithClient } from '@/services/supabase/receipts/types';
import { useInvoices } from '@/hooks/use-invoices';

interface SimpleReceiptsTableProps {
  receipts: ReceiptWithClient[];
  onEdit: (receipt: ReceiptWithClient) => void;
  onDelete: (receipt: ReceiptWithClient) => void;
}

export const SimpleReceiptsTable = ({
  receipts,
  onEdit,
  onDelete
}: SimpleReceiptsTableProps) => {
  const { invoices } = useInvoices();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Encaissé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount).replace('.', ',');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getInvoiceDisplay = (invoiceId: string | null) => {
    if (!invoiceId || !invoices) {
      return 'Sans facture';
    }
    
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      return 'Facture introuvable';
    }
    
    const clientName = invoice.clients 
      ? `${invoice.clients.first_name} ${invoice.clients.last_name}` 
      : 'Client non assigné';
    
    const amount = typeof invoice.amount === 'number' 
      ? invoice.amount.toFixed(2).replace('.', ',')
      : '0,00';
    
    return `Facture n°${invoice.reference} - ${clientName} - ${amount} €`;
  };

  if (receipts.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="Aucun encaissement"
        description="Aucun encaissement n'a été enregistré pour le moment."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Numéro</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Facture</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Méthode de paiement</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receipts.map((receipt) => (
          <TableRow key={receipt.id}>
            <TableCell>{receipt.reference || 'N/A'}</TableCell>
            <TableCell>{formatDate(receipt.date)}</TableCell>
            <TableCell>
              {getInvoiceDisplay(receipt.invoice_id)}
            </TableCell>
            <TableCell>
              {formatAmount(receipt.amount)}
            </TableCell>
            <TableCell>{receipt.payment_method}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(receipt.status)}`}>
                {receipt.status}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-1">
                <Button variant="ghost" size="icon" title="Voir les détails">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onEdit(receipt)}
                  title="Modifier"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete(receipt)}
                  title="Supprimer"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
