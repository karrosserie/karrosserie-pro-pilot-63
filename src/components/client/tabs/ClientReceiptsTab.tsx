
import React, { useState } from 'react';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import { Banknote, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import { useInvoices } from '@/hooks/use-invoices';
import ReceiptDialog from '@/components/receipts/ReceiptDialog';
import { getClientDisplayName } from '@/utils/clientDisplayUtils';

interface ClientReceiptsTabProps {
  clientId: string;
}

const ClientReceiptsTab: React.FC<ClientReceiptsTabProps> = ({ clientId }) => {
  const { receipts, isLoading, deleteReceipt } = useReceiptsData();
  const { invoices } = useInvoices();
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  // Filter receipts by client via invoices
  const clientReceipts = receipts?.filter(receipt => {
    if (receipt.invoices && receipt.invoices.client_id === clientId) {
      return true;
    }
    return false;
  }) || [];
  const { sortedData, sortConfig, handleSort } = useTableSorting(clientReceipts, 'reference');

  const getInvoiceDisplay = (invoiceId: string | null) => {
    if (!invoiceId || !invoices) {
      return 'Sans facture';
    }
    
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      return 'Facture introuvable';
    }
    
    const clientName = invoice.clients 
      ? getClientDisplayName(invoice.clients)
      : 'Client non assigné';
    
    const amount = typeof invoice.amount === 'number' 
      ? invoice.amount.toFixed(2).replace('.', ',')
      : '0,00';
    
    return `Facture n°${invoice.reference} - ${clientName} - ${amount} €`;
  };

  const handleView = (receipt: any) => {
    setSelectedReceipt(receipt);
    setEditDialogOpen(true);
  };

  const handleEdit = (receipt: any) => {
    setSelectedReceipt(receipt);
    setEditDialogOpen(true);
  };

  const handleDelete = async (receipt: any) => {
    const confirmed = await confirm({
      title: 'Supprimer l\'encaissement',
      description: 'Êtes-vous sûr de vouloir supprimer cet encaissement ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      deleteReceipt.mutate(receipt.id);
    }
  };


  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return '-';
    }
  };

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

  return (
    <>
      <div className="card-container p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHeader sortKey="reference" sortConfig={sortConfig} onSort={handleSort}>
                Numéro
              </SortableTableHeader>
              <SortableTableHeader sortKey="date" sortConfig={sortConfig} onSort={handleSort}>
                Date
              </SortableTableHeader>
              <TableHead>Facture</TableHead>
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
            {sortedData.length > 0 ? (
              sortedData.map((receipt) => (
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
                    <TableCell>{receipt.payment_method}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t-0">
                    <TableCell colSpan={6} className="py-3 border-t-0">
                      <div className="flex flex-wrap gap-2 justify-end px-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(receipt)}
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
                          onClick={() => handleDelete(receipt)}
                          title="Supprimer"
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Banknote className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-900">Aucun encaissement</h3>
                    <p className="text-gray-500 mt-1">Ce client n'a pas encore d'encaissement.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedReceipt && (
        <ReceiptDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          receipt={selectedReceipt}
        />
      )}
    </>
  );
};

export default ClientReceiptsTab;
