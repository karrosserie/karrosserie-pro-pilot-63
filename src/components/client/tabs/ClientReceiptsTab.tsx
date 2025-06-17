
import React from 'react';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { SimpleTable } from '@/components/ui/simple-table';
import { Banknote, Eye, Pencil, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

interface ClientReceiptsTabProps {
  clientId: string;
}

const ClientReceiptsTab: React.FC<ClientReceiptsTabProps> = ({ clientId }) => {
  const { receipts, isLoading, deleteReceipt } = useReceiptsData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  // Filtrer les encaissements par client via les factures associées
  const clientReceipts = receipts?.filter(receipt => {
    if (receipt.invoices && receipt.invoices.client_id === clientId) {
      return true;
    }
    return false;
  }) || [];

  const handleView = (receipt: any) => {
    console.log('View receipt:', receipt);
  };

  const handleEdit = (receipt: any) => {
    console.log('Edit receipt:', receipt);
  };

  const handleDelete = (receipt: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'encaissement ${receipt.reference} ?`)) {
      deleteReceipt.mutate(receipt.id);
    }
  };

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }) + ' €';
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
      case 'Rejeté':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "reference",
      header: "Numéro",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("reference") as string}</span>
      )
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => formatDate(row.getValue("date") as string)
    },
    {
      accessorKey: "invoices",
      header: "Client",
      cell: ({ row }) => {
        const invoice = row.getValue("invoices") as any;
        if (invoice && invoice.clients) {
          return `${invoice.clients.first_name} ${invoice.clients.last_name}`;
        }
        return "-";
      }
    },
    {
      accessorKey: "invoices",
      header: "Facture",
      cell: ({ row }) => {
        const invoice = row.getValue("invoices") as any;
        return invoice ? invoice.reference : "-";
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
              onClick={() => handleView(receipt)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(receipt)}
            >
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
