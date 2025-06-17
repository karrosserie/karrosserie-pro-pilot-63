
import React from 'react';
import { useCredits } from '@/hooks/use-credits';
import { SimpleTable } from '@/components/ui/simple-table';
import { CreditCard, Eye, Pencil, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface ClientCreditsTabProps {
  clientId: string;
}

const ClientCreditsTab: React.FC<ClientCreditsTabProps> = ({ clientId }) => {
  const { credits, isLoading, deleteCredit } = useCredits();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientCredits = credits?.filter(credit => credit.client_id === clientId) || [];

  const handleView = (credit: any) => {
    console.log('View credit:', credit);
  };

  const handleEdit = (credit: any) => {
    console.log('Edit credit:', credit);
  };

  const handleDelete = (credit: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'avoir ${credit.reference} ?`)) {
      deleteCredit.mutate(credit.id);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "reference",
      header: "Référence",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("reference") as string}</span>
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
        <span className="font-medium">{formatCurrency(row.getValue("amount") as number)}</span>
      )
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (row.getValue("notes") as string) || "-"
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === 'Payé' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const credit = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(credit)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(credit)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(credit)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      }
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
    <SimpleTable
      columns={columns}
      data={clientCredits}
    />
  );
};

export default ClientCreditsTab;
