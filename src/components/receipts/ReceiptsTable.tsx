
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { ReceiptWithClient } from '@/services/supabase/receipts/types';

interface ReceiptsTableProps {
  receipts: ReceiptWithClient[];
  onEdit: (receipt: ReceiptWithClient) => void;
  onDelete: (receiptId: string) => void;
}

export const ReceiptsTable = ({ receipts, onEdit, onDelete }: ReceiptsTableProps) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount).replace('.', ',');
  };

  const formatInvoiceInfo = (receipt: any) => {
    if (!receipt.invoices) return 'N/A';
    
    const invoice = receipt.invoices;
    const clientName = invoice.clients 
      ? `${invoice.clients.first_name} ${invoice.clients.last_name}`
      : 'Client inconnu';
    
    const formattedAmount = formatAmount(invoice.amount);
    
    return `Facture n°${invoice.reference} - ${clientName} - ${formattedAmount}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Référence</TableHead>
          <TableHead>Facture</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receipts.map((receipt) => (
          <TableRow key={receipt.id}>
            <TableCell className="font-medium">{receipt.reference}</TableCell>
            <TableCell>{formatInvoiceInfo(receipt)}</TableCell>
            <TableCell>{formatDate(receipt.date)}</TableCell>
            <TableCell>{formatAmount(receipt.amount)}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                receipt.status === 'Payé' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {receipt.status}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(receipt)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(receipt.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
