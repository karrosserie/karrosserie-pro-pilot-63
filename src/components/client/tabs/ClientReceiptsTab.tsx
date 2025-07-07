import React, { useState } from 'react';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { SimpleTable } from '@/components/ui/simple-table';
import { Banknote, Eye, Pencil, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { useToast } from '@/hooks/use-toast';

interface ClientReceiptsTabProps {
  clientId: string;
}

const ClientReceiptsTab: React.FC<ClientReceiptsTabProps> = ({ clientId }) => {
  const { receipts, isLoading, deleteReceipt } = useReceiptsData();
  const { toast } = useToast();

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

  const handleView = (receipt: any) => {
    toast({
      title: "Fonctionnalité à implémenter",
      description: `Affichage de l'encaissement ${receipt.reference || 'sans référence'}`,
    });
  };

  const handleEdit = (receipt: any) => {
    toast({
      title: "Fonctionnalité à implémenter",
      description: `Édition de l'encaissement ${receipt.reference || 'sans référence'}`,
    });
  };

  const handleDelete = (receipt: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'encaissement ?`)) {
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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => formatDate(row.getValue("date") as string)
    },
    {
      accessorKey: "invoices",
      header: "Facture",
      cell: ({ row }) => {
        const invoice = row.getValue("invoices") as any;
        return invoice?.reference || "-";
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
        return <StatusBadge status={status || 'En attente'} />;
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
    <SimpleTable
      columns={columns}
      data={clientReceipts}
    />
  );
};

export default ClientReceiptsTab;
