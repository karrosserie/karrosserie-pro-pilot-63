
import React, { useState } from 'react';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { SimpleTable } from '@/components/ui/simple-table';
import { Banknote, Eye, Pencil, Trash, MoreVertical } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { useToast } from '@/hooks/use-toast';
import { useInvoices } from '@/hooks/use-invoices';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Printer, Mail } from 'lucide-react';
import { ReceiptDialog } from '@/components/receipts/ReceiptDialog';

interface ClientReceiptsTabProps {
  clientId: string;
}

const ClientReceiptsTab: React.FC<ClientReceiptsTabProps> = ({ clientId }) => {
  const { receipts, isLoading, deleteReceipt } = useReceiptsData();
  const { invoices } = useInvoices();
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
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
    setViewDialogOpen(true);
  };

  const handleEdit = (receipt: any) => {
    setSelectedReceipt(receipt);
    setEditDialogOpen(true);
  };

  const handleDelete = (receipt: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'encaissement ?`)) {
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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => formatDate(row.getValue("date") as string)
    },
    {
      accessorKey: "invoice_id",
      header: "Facture",
      cell: ({ row }) => {
        const receipt = row.original;
        return getInvoiceDisplay(receipt.invoice_id);
      }
    },
    {
      accessorKey: "amount",
      header: "Montant",
      cell: ({ row }) => {
        const amount = row.getValue("amount");
        return formatAmount(amount as number);
      }
    },
    {
      accessorKey: "payment_method",
      header: "Mode de paiement",
      cell: ({ row }) => {
        const paymentMethod = row.getValue("payment_method") as string;
        return paymentMethod || "-";
      }
    },
    {
      accessorKey: "bank_account",
      header: "Compte bancaire",
      cell: ({ row }) => {
        const bankAccount = row.getValue("bank_account") as string;
        return bankAccount || "-";
      }
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status || 'En attente')}`}>
            {status || 'En attente'}
          </span>
        );
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const receipt = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleView(receipt);
              }}
              title="Voir les détails"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(receipt);
              }}
              title="Modifier"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(receipt);
              }}
              title="Supprimer"
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
        );
      }
    }
  ];

  if (clientReceipts.length === 0) {
    return (
      <div className="text-center py-8">
        <Banknote className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun encaissement</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore d'encaissement.</p>
      </div>
    );
  }

  return (
    <>
      <SimpleTable
        columns={columns}
        data={clientReceipts}
      />

      {selectedReceipt && (
        <>
          <ReceiptDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            receipt={selectedReceipt}
          />

          <ReceiptDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            receipt={selectedReceipt}
            readOnly={true}
          />
        </>
      )}
    </>
  );
};

export default ClientReceiptsTab;
