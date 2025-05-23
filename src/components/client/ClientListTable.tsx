
import React from 'react';
import { Button } from '@/components/ui/button';
import { Client } from '@/services/supabase/clients';
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import ClientDeleteDialog from './ClientDeleteDialog';

interface ClientListTableProps {
  clients: Client[];
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
}

const ClientListTable: React.FC<ClientListTableProps> = ({
  clients,
  onViewClient,
  onEditClient,
  onDeleteClient
}) => {
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.first_name} {row.original.last_name}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Téléphone",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-right space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onViewClient(row.original)}>
            Voir
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEditClient(row.original)}>
            Éditer
          </Button>
          <ClientDeleteDialog 
            client={row.original}
            onDelete={onDeleteClient}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={clients || []}
      searchKey="first_name"
      searchPlaceholder="Rechercher un client..."
    />
  );
};

export default ClientListTable;
