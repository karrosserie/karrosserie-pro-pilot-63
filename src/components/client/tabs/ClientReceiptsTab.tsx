
import React, { useState } from 'react';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Banknote, Eye, Pencil, Trash, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import { useInvoices } from '@/hooks/use-invoices';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Printer, Mail } from 'lucide-react';
import ReceiptDialog from '@/components/receipts/ReceiptDialog';

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

  const handleDownload = (receipt: any) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de l'encaissement...`
    });
  };

  const handlePrint = (receipt: any) => {
    toast({
      title: "Impression",
      description: `Impression de l'encaissement...`
    });
  };

  const handleSendEmail = (receipt: any) => {
    toast({
      title: "Envoi par e-mail",
      description: `Envoi de l'encaissement par e-mail...`
    });
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
      <div className="card-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Date d'encaissement</TableHead>
              <TableHead>Facture</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Mode de paiement</TableHead>
              <TableHead>Compte bancaire</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientReceipts.length > 0 ? (
              clientReceipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">{receipt.reference}</TableCell>
                  <TableCell>{formatDate(receipt.date)}</TableCell>
                  <TableCell>{getInvoiceDisplay(receipt.invoice_id)}</TableCell>
                  <TableCell>{formatAmount(receipt.amount)}</TableCell>
                  <TableCell>{receipt.payment_method || "-"}</TableCell>
                  <TableCell>{receipt.bank_account || "-"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(receipt.status || 'En attente')}`}>
                      {receipt.status || 'En attente'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleView(receipt)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(receipt)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(receipt)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem onClick={() => handleDownload(receipt)}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrint(receipt)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendEmail(receipt)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Envoyer par e-mail
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
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
