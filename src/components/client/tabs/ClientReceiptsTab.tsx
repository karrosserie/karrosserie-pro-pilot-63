
import React from 'react';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { DataTable } from '@/components/ui/data-table';
import { Banknote, Eye, Pencil, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "reference",
      header: "Référence",
      cell: ({ row }) => (
        <span className="font-medium">#{row.getValue("reference")}</span>
      )
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.getValue("date") as string).toLocaleDateString()
    },
    {
      accessorKey: "amount",
      header: "Montant",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("amount")}€</span>
      )
    },
    {
      accessorKey: "payment_method",
      header: "Méthode",
      cell: ({ row }) => row.getValue("payment_method")
    },
    {
      accessorKey: "invoices",
      header: "Facture",
      cell: ({ row }) => {
        const invoice = row.getValue("invoices") as any;
        return invoice ? `#${invoice.reference}` : "-";
      }
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge variant={status === 'Encaissé' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      header: "",
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
    <DataTable
      columns={columns}
      data={clientReceipts}
      searchKey="reference"
      searchPlaceholder="Rechercher par référence..."
    />
  );
};

export default ClientReceiptsTab;
