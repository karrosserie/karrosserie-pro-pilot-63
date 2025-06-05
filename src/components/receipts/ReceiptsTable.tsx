
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, Download, Pencil, Trash, TrendingUp } from 'lucide-react';

interface Receipt {
  id: string;
  reference: string;
  date: string;
  amount: number;
  status: string;
  client: string;
  invoice: string;
  payment_method: string;
  bank_account: string;
}

interface ReceiptsTableProps {
  receipts: Receipt[];
  onEdit: (receipt: Receipt) => void;
  onDelete: (receipt: Receipt) => void;
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="card-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Facture</TableHead>
            <TableHead>Méthode</TableHead>
            <TableHead>Compte</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.length > 0 ? (
            receipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell>{new Date(receipt.date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{receipt.client}</TableCell>
                <TableCell>{receipt.invoice}</TableCell>
                <TableCell>{receipt.payment_method}</TableCell>
                <TableCell>{receipt.bank_account}</TableCell>
                <TableCell>{formatAmount(receipt.amount)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(receipt.status)}`}>
                    {receipt.status}
                  </span>
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
                      onClick={() => onDelete(receipt)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                <div className="flex flex-col items-center justify-center py-8">
                  <TrendingUp className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                  <p className="text-gray-500 mt-1">
                    Aucun encaissement correspondant à votre recherche n'a été trouvé.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
