
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ReceiptWithClient } from '@/services/supabase/receipts/types';

interface ReceiptsTableProps {
  receipts: ReceiptWithClient[];
  onEdit: (receipt: ReceiptWithClient) => void;
  onDelete: (receipt: ReceiptWithClient) => void;
}

export const ReceiptsTable = ({
  receipts,
  onEdit,
  onDelete
}: ReceiptsTableProps) => {
  if (receipts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun encaissement trouvé
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Facture</TableHead>
            <TableHead>Mode de paiement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.map((receipt) => (
            <TableRow key={receipt.id}>
              <TableCell className="font-medium">
                {receipt.reference || 'N/A'}
              </TableCell>
              <TableCell>
                {new Date(receipt.date).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>
                {typeof receipt.amount === 'number' 
                  ? receipt.amount.toFixed(2) 
                  : receipt.amount || '0.00'} €
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs ${
                  receipt.status === 'Payé' 
                    ? 'bg-green-100 text-green-800'
                    : receipt.status === 'En attente'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {receipt.status}
                </span>
              </TableCell>
              <TableCell>{receipt.client || 'N/A'}</TableCell>
              <TableCell>{receipt.invoice || 'N/A'}</TableCell>
              <TableCell>{receipt.payment_method}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(receipt)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(receipt)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
