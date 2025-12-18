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
import { getClientDisplayName } from '@/utils/clientDisplayUtils';

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
      ? getClientDisplayName(invoice.clients)
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
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2 md:px-0">Encaissements</h3>
        {/* Mobile: Cards empilées */}
        <div className="md:hidden space-y-3 p-2">
          {sortedData.map((receipt) => (
            <div key={receipt.id} className="bg-white border rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-sm">{receipt.reference || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{formatDate(receipt.date)}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(receipt.status)}`}>
                  {receipt.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-karrosserie-orange mb-1">{formatAmount(receipt.amount)}</p>
              <p className="text-xs text-gray-500 mb-3">{receipt.payment_method}</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(receipt)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-500 border-red-500" onClick={() => handleDelete(receipt)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {sortedData.length === 0 && (
            <div className="text-center py-8">
              <Banknote className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-900 text-sm">Aucun encaissement</h3>
              <p className="text-gray-500 text-xs mt-1">Ce véhicule n'a pas encore d'encaissement.</p>
            </div>
          )}
        </div>

        {/* Desktop: Table */}
        <div className="hidden md:block card-container p-0">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <SortableTableHeader sortKey="reference" sortConfig={sortConfig} onSort={handleSort}>Numéro</SortableTableHeader>
                  <SortableTableHeader sortKey="date" sortConfig={sortConfig} onSort={handleSort}>Date</SortableTableHeader>
                  <TableHead>Facture</TableHead>
                  <SortableTableHeader sortKey="amount" sortConfig={sortConfig} onSort={handleSort}>Montant</SortableTableHeader>
                  <SortableTableHeader sortKey="payment_method" sortConfig={sortConfig} onSort={handleSort}>Méthode</SortableTableHeader>
                  <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>Statut</SortableTableHeader>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.length > 0 ? sortedData.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell>{receipt.reference || 'N/A'}</TableCell>
                    <TableCell>{formatDate(receipt.date)}</TableCell>
                    <TableCell>{getInvoiceDisplay(receipt.invoice_id)}</TableCell>
                    <TableCell>{formatAmount(receipt.amount)}</TableCell>
                    <TableCell>{receipt.payment_method}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(receipt)}><Pencil className="h-4 w-4 mr-1" />Modifier</Button>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-500" onClick={() => handleDelete(receipt)}><Trash className="h-4 w-4 mr-1" />Supprimer</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Banknote className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Aucun encaissement</h3>
                      <p className="text-gray-500 mt-1">Ce véhicule n'a pas encore d'encaissement.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {selectedReceipt && <ReceiptDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} receipt={selectedReceipt} />}
    </>
  );
};

export default VehicleReceiptsTab;