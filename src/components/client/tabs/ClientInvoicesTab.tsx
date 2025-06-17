
import React from 'react';
import { useInvoices } from '@/hooks/use-invoices';
import { DataTable } from '@/components/ui/data-table';
import { Receipt } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

interface ClientInvoicesTabProps {
  clientId: string;
}

const ClientInvoicesTab: React.FC<ClientInvoicesTabProps> = ({ clientId }) => {
  const { invoices, isLoading } = useInvoices();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientInvoices = invoices?.filter(invoice => invoice.client_id === clientId) || [];

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
      accessorKey: "due_date",
      header: "Échéance",
      cell: ({ row }) => {
        const dueDate = row.getValue("due_date");
        return dueDate ? new Date(dueDate as string).toLocaleDateString() : "-";
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
        <Badge variant={row.getValue("status") === 'Payée' ? 'default' : 'secondary'}>
          {row.getValue("status")}
        </Badge>
      )
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
    <DataTable
      columns={columns}
      data={clientInvoices}
      searchKey="reference"
      searchPlaceholder="Rechercher par référence..."
    />
  );
};

export default ClientInvoicesTab;
