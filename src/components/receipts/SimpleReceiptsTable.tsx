
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
import { Pencil, Trash, Receipt, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from 'react';
import { ReceiptWithClient } from '@/services/supabase/receipts/types';
import { useInvoices } from '@/hooks/use-invoices';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';

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
  const { sortedData, sortConfig, handleSort } = useTableSorting(receipts, 'date');
  const [checkViewUrl, setCheckViewUrl] = useState<string | null>(null);

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

  const hasCheckScan = (receipt: ReceiptWithClient) => {
    return receipt.payment_method === 'Chèque' && 
           receipt.payment_proofs && 
           receipt.payment_proofs.length > 0;
  };

  if (sortedData.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="Aucun encaissement"
        description="Aucun encaissement n'a été enregistré pour le moment."
      />
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHeader sortKey="reference" sortConfig={sortConfig} onSort={handleSort}>
              Numéro
            </SortableTableHeader>
            <SortableTableHeader sortKey="date" sortConfig={sortConfig} onSort={handleSort}>
              Date
            </SortableTableHeader>
            <SortableTableHeader sortKey="invoice" sortConfig={sortConfig} onSort={handleSort}>
              Facture
            </SortableTableHeader>
            <SortableTableHeader sortKey="amount" sortConfig={sortConfig} onSort={handleSort}>
              Montant
            </SortableTableHeader>
            <SortableTableHeader sortKey="payment_method" sortConfig={sortConfig} onSort={handleSort}>
              Méthode de paiement
            </SortableTableHeader>
            <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>
              Statut
            </SortableTableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((receipt) => (
            <React.Fragment key={receipt.id}>
              <TableRow className="border-b-0">
                <TableCell>{receipt.reference || 'N/A'}</TableCell>
                <TableCell>{formatDate(receipt.date)}</TableCell>
                <TableCell>
                  {getInvoiceDisplay(receipt.invoice_id)}
                </TableCell>
                <TableCell>
                  {formatAmount(receipt.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {receipt.payment_method}
                    {hasCheckScan(receipt) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-primary hover:text-primary/80"
                        onClick={() => setCheckViewUrl(receipt.payment_proofs![0])}
                        title="Voir le chèque scanné"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(receipt.status)}`}>
                    {receipt.status}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow className="border-t-0">
                <TableCell colSpan={6} className="py-3 border-t-0">
                  <div className="flex flex-wrap gap-2 justify-end px-4">
                    <Button variant="edit" size="sm" onClick={() => onEdit(receipt)}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button variant="delete" size="sm" onClick={() => onDelete(receipt)}>
                      <Trash className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {/* Modal pour visualiser le chèque */}
      <Dialog open={!!checkViewUrl} onOpenChange={() => setCheckViewUrl(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chèque scanné</DialogTitle>
          </DialogHeader>
          {checkViewUrl && (
            <div className="flex justify-center">
              <img 
                src={checkViewUrl} 
                alt="Chèque scanné" 
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
