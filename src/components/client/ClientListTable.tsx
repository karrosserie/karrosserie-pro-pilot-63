
import React from 'react';
import { Button } from '@/components/ui/button';
import { Client } from '@/services/supabase/clients';
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from '@/components/ui/status-badge';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { MoreHorizontal } from 'lucide-react';
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
      id: "license_status",
      header: "Permis de conduire",
      cell: ({ row }) => {
        const client = row.original as any;
        const hasFrontLicense = client.driver_license_front_url;
        const hasBackLicense = client.driver_license_back_url;
        const hasCompleteLicense = hasFrontLicense && hasBackLicense;
        
        return (
          <StatusBadge 
            status={hasCompleteLicense ? "Permis importé" : "Pas de permis"}
          />
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-right space-x-2 flex items-center justify-end">
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
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                Créer un devis
              </ContextMenuItem>
              <ContextMenuItem>
                Créer une facture
              </ContextMenuItem>
              <ContextMenuItem>
                Créer un avoir
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
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
