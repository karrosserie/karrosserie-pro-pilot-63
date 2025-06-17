
import React from 'react';
import { useQuotes } from '@/hooks/use-quotes';
import { DataTable } from '@/components/ui/data-table';
import { FileText } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

interface ClientQuotesTabProps {
  clientId: string;
}

const ClientQuotesTab: React.FC<ClientQuotesTabProps> = ({ clientId }) => {
  const { quotes, isLoading } = useQuotes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientQuotes = quotes?.filter(quote => quote.client_id === clientId) || [];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "reference",
      header: "Référence",
      cell: ({ row }) => `#${row.getValue("reference")}`
    },
    {
      accessorKey: "created_at",
      header: "Date création",
      cell: ({ row }) => new Date(row.getValue("created_at") as string).toLocaleDateString()
    },
    {
      accessorKey: "amount",
      header: "Montant",
      cell: ({ row }) => `${row.getValue("amount")}€`
    },
    {
      accessorKey: "valid_until",
      header: "Valide jusqu'au",
      cell: ({ row }) => {
        const validUntil = row.getValue("valid_until");
        return validUntil ? new Date(validUntil as string).toLocaleDateString() : "-";
      }
    },
    {
      accessorKey: "vehicles",
      header: "Véhicule",
      cell: ({ row }) => {
        const vehicle = row.getValue("vehicles") as any;
        return vehicle?.license_plate || "-";
      }
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") === 'Accepté' ? 'default' : 'secondary'}>
          {row.getValue("status")}
        </Badge>
      )
    }
  ];

  if (clientQuotes.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun devis</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore de devis.</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={clientQuotes}
      searchKey="reference"
      searchPlaceholder="Rechercher par référence..."
    />
  );
};

export default ClientQuotesTab;
