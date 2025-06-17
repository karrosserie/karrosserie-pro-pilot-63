
import React from 'react';
import { useQuotes } from '@/hooks/use-quotes';
import { DataTable } from '@/components/ui/data-table';
import { FileText, Eye, Pencil, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ClientQuotesTabProps {
  clientId: string;
}

const ClientQuotesTab: React.FC<ClientQuotesTabProps> = ({ clientId }) => {
  const { quotes, isLoading, deleteQuote } = useQuotes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientQuotes = quotes?.filter(quote => quote.client_id === clientId) || [];

  const handleView = (quote: any) => {
    console.log('View quote:', quote);
  };

  const handleEdit = (quote: any) => {
    console.log('Edit quote:', quote);
  };

  const handleDelete = (quote: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le devis ${quote.reference} ?`)) {
      deleteQuote.mutate(quote.id);
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
      accessorKey: "created_at",
      header: "Date création",
      cell: ({ row }) => new Date(row.getValue("created_at") as string).toLocaleDateString()
    },
    {
      accessorKey: "amount",
      header: "Montant",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("amount")}€</span>
      )
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
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge variant={status === 'Accepté' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(quote)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(quote)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(quote)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      }
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
