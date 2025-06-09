
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Trash, Download } from 'lucide-react';
import { ReceiptWithClient } from '@/services/supabase/receipts/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReceiptsTableProps {
  receipts: ReceiptWithClient[];
  onEdit: (receipt: ReceiptWithClient) => void;
  onDelete: (receiptId: string) => void;
}

export const ReceiptsTable = ({ receipts, onEdit, onDelete }: ReceiptsTableProps) => {
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return '-';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount).replace('.', ',');
  };

  const formatInvoiceInfo = (receipt: ReceiptWithClient) => {
    if (!receipt.invoices) return '-';
    
    const clientName = receipt.invoices.clients 
      ? `${receipt.invoices.clients.first_name} ${receipt.invoices.clients.last_name}`
      : 'Client inconnu';
    const formattedAmount = formatAmount(receipt.invoices.amount);
    
    return `Facture n°${receipt.invoices.reference} - ${clientName} - ${formattedAmount}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Référence</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Facture</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Mode de paiement</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receipts.map((receipt) => (
          <TableRow key={receipt.id}>
            <TableCell className="font-medium">{receipt.reference}</TableCell>
            <TableCell>{formatDate(receipt.payment_date)}</TableCell>
            <TableCell>{formatInvoiceInfo(receipt)}</TableCell>
            <TableCell>{formatAmount(receipt.amount)}</TableCell>
            <TableCell>{receipt.payment_method}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(receipt.status || 'En attente')}>
                {receipt.status || 'En attente'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-1">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(receipt)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete(receipt.id)}
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
