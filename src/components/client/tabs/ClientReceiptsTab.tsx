
import React from 'react';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { DataTable } from '@/components/ui/data-table';
import { Banknote } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

interface ClientReceiptsTabProps {
  clientId: string;
}

const ClientReceiptsTab: React.FC<ClientReceiptsTabProps> = ({ clientId }) => {
  const { receipts, isLoading } = useReceiptsData();

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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "reference",
      header: "Référence",
      cell: ({ row }) => `#${row.getValue("reference")}`
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.getValue("date") as string).toLocaleDateString()
    },
    {
      accessorKey: "amount",
      header: "Montant",
      cell: ({ row }) => `${row.getValue("amount")}€`
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
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") === 'Encaissé' ? 'default' : 'secondary'}>
          {row.getValue("status")}
        </Badge>
      )
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
