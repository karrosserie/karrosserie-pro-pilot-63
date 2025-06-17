
import React from 'react';
import { useCredits } from '@/hooks/use-credits';
import { DataTable } from '@/components/ui/data-table';
import { CreditCard } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

interface ClientCreditsTabProps {
  clientId: string;
}

const ClientCreditsTab: React.FC<ClientCreditsTabProps> = ({ clientId }) => {
  const { credits, isLoading } = useCredits();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientCredits = credits?.filter(credit => credit.client_id === clientId) || [];

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
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => row.getValue("notes") || "-"
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") === 'Payé' ? 'default' : 'secondary'}>
          {row.getValue("status")}
        </Badge>
      )
    }
  ];

  if (clientCredits.length === 0) {
    return (
      <div className="text-center py-8">
        <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun avoir</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore d'avoir.</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={clientCredits}
      searchKey="reference"
      searchPlaceholder="Rechercher par référence..."
    />
  );
};

export default ClientCreditsTab;
