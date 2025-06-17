
import React from 'react';
import { useInvoices } from '@/hooks/use-invoices';
import { SimpleTable } from '@/components/ui/simple-table';
import { Receipt, Eye, Pencil, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface ClientInvoicesTabProps {
  clientId: string;
}

const ClientInvoicesTab: React.FC<ClientInvoicesTabProps> = ({ clientId }) => {
  const { invoices, isLoading, deleteInvoice } = useInvoices();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientInvoices = invoices?.filter(invoice => invoice.client_id === clientId) || [];

  const handleView = (invoice: any) => {
    console.log('View invoice:', invoice);
  };

  const handleEdit = (invoice: any) => {
    console.log('Edit invoice:', invoice);
  };

  const handleDelete = (invoice: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la facture ${invoice.reference} ?`)) {
      deleteInvoice.mutate(invoice.id);
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
      accessorKey: "due_date",
      header: "Échéance",
      cell: ({ row }) => {
        const dueDate = row.getValue("due_date") as string;
        return dueDate ? new Date(dueDate).toLocaleDateString() : "-";
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
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === 'Payée' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(invoice)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(invoice)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(invoice)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  if (clientInvoices.length === 0) {
    return (
      <div className="text-center py-8">
        <Receipt className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune facture</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore de facture.</p>
      </div>
    );
  }

  return (
    <SimpleTable
      columns={columns}
      data={clientInvoices}
    />
  );
};

export default ClientInvoicesTab;
