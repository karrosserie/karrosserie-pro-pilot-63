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

interface VehicleReceiptsTabProps {
  vehicleId: string;
}

const VehicleReceiptsTab: React.FC<VehicleReceiptsTabProps> = ({ vehicleId }) => {
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

  const vehicleReceipts = receipts?.filter(receipt => {
    if (receipt.invoice_id && invoices) {
      const relatedInvoice = invoices.find(invoice => invoice.id === receipt.invoice_id);
      return relatedInvoice?.vehicle_id === vehicleId;
    }
    return false;
  }) || [];
  const { sortedData, sortConfig, handleSort } = useTableSorting(vehicleReceipts, 'reference');

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
      <div className="w-full max-w-full overflow-hidden">
        <div className="card-container p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[450px] w-full">
            <TableHeader>
              <TableRow>
                <SortableTableHeader sortKey="reference" sortConfig={sortConfig} onSort={handleSort}>
                  Numéro
                </SortableTableHeader>
                <SortableTableHeader sortKey="date" sortConfig={sortConfig} onSort={handleSort}>
                  Date
                </SortableTableHeader>
                <TableHead className="hidden md:table-cell">Facture</TableHead>
                <SortableTableHeader sortKey="amount" sortConfig={sortConfig} onSort={handleSort}>
                  Montant
                </SortableTableHeader>
                <SortableTableHeader sortKey="payment_method" sortConfig={sortConfig} onSort={handleSort} className="hidden sm:table-cell">
                  Méthode
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
                    <TableRow className="hover:bg-gray-50 border-b-0">
                      <TableCell className="text-xs sm:text-sm py-2 sm:py-4">{receipt.reference || 'N/A'}</TableCell>
                      <TableCell className="text-xs sm:text-sm py-2 sm:py-4">{formatDate(receipt.date)}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs sm:text-sm py-2 sm:py-4">
                        {getInvoiceDisplay(receipt.invoice_id)}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm py-2 sm:py-4">
                        {formatAmount(receipt.amount)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs sm:text-sm py-2 sm:py-4">{receipt.payment_method}</TableCell>
                      <TableCell className="py-2 sm:py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(receipt.status)}`}>
                          {receipt.status}
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-t-0">
                      <TableCell colSpan={6} className="py-2 sm:py-3 border-t-0">
                        <div className="flex flex-wrap gap-1 sm:gap-2 justify-end px-2 sm:px-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                            onClick={() => handleEdit(receipt)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="hidden sm:inline sm:ml-1">Modifier</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3 text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
                            onClick={() => handleDelete(receipt)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="hidden sm:inline sm:ml-1">Supprimer</span>
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
                      <p className="text-gray-500 mt-1">Ce véhicule n'a pas encore d'encaissement.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            </Table>
          </div>
        </div>
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

export default VehicleReceiptsTab;